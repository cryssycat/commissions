const corsHeaders = {
  "Access-Control-Allow-Origin": "https://starsundae.pages.dev",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================
    // CORS
    // =========================
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {

      // =========================
      // HEALTH
      // =========================
      if (url.pathname === "/health") {
        return json({ ok: true });
      }

      // =========================
      // GET COMMISSIONS
      // =========================
      if (url.pathname === "/commissions" && request.method === "GET") {

        const res = await fetch(
          `https://api.notion.com/v1/databases/${env.NOTION_DB_ID}/query`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.NOTION_TOKEN}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ page_size: 100 }),
          }
        );

        const data = await res.json();

        const items = (data.results || []).map((page) => {
          const p = page.properties || {};

          return {
            id: page.id,
            title: p.Title?.title?.[0]?.plain_text || "Untitled",
            description: p.Description?.rich_text?.[0]?.plain_text || "",
            price: p.Price?.rich_text?.[0]?.plain_text || "",
            status: p.Status?.select?.name || "open",

            image:
              p.Image?.files?.[0]?.file?.url ||
              p.Image?.files?.[0]?.external?.url ||
              p.Image?.url ||
              "",
          };
        });

        return json(items);
      }

      // =========================
      // SUBMIT FORM → QUEUE DB
      // =========================
      if (url.pathname === "/submit" && request.method === "POST") {

        const body = await request.json();

        const notion = await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.NOTION_TOKEN}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parent: {
              database_id: env.NOTION_QUEUE_DB_ID,
            },
            properties: {
              Name: {
                title: [
                  { text: { content: body.name || "Unnamed" } }
                ]
              },
              Type: {
                rich_text: [
                  { text: { content: body.type || "" } }
                ]
              },
              Details: {
                rich_text: [
                  { text: { content: body.details || "" } }
                ]
              },
              Email: {
                rich_text: [
                  { text: { content: body.email || "" } }
                ]
              },
              Status: {
                select: { name: "Pending" }
              }
            }
          })
        });

        const result = await notion.json();

        return json({
          success: true,
          result
        });
      }

      // =========================
      // 404
      // =========================
      return json({ error: "Not found" }, 404);

    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};


const ENDPOINT = "https://commissions.crysthigpen.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  loadCommissions();
  initForm();
});

async function loadCommissions() {
  const container = document.getElementById("commission-container");

  const res = await fetch(`${ENDPOINT}/commissions`);
  const data = await res.json();

  if (!Array.isArray(data)) return;

  container.innerHTML = data.map(item => `
    <div class="commission-card">
      ${item.image ? `<img src="${item.image}" class="commission-img">` : ""}
      <div class="commission-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="commission-meta">
          <span class="price">${item.price}</span>
          <span class="status status-${item.status}">${item.status}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function initForm() {
  const form = document.getElementById("queueForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Submitting...";

    const data = Object.fromEntries(new FormData(form));

    const res = await fetch(`${ENDPOINT}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      status.textContent = "Submitted successfully!";
      form.reset();
    } else {
      status.textContent = "Submission failed.";
    }
  });
}
