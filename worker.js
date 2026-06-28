export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/commissions") {
      const res = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_DB_ID}/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      const data = await res.json();
      const results = data.results || [];

      const cleaned = results.map(page => {
        const p = page.properties;

        const get = (f) =>
          f?.title?.[0]?.plain_text ||
          f?.rich_text?.[0]?.plain_text ||
          f?.select?.name ||
          f?.number ||
          "";

        return {
          id: page.id,
          name: get(p.Name),
          price: get(p.Price),
          type: get(p.Type),
          description: get(p.Description),
          status: get(p.Status)
        };
      });

      return new Response(JSON.stringify(cleaned), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response("Star Hub Worker Online");
  }
};
