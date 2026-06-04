const { sql, initDb, makeId, getUserFromRequest, sendJson } = require("./_lib/db");

module.exports = async function handler(req, res) {
  try {
    await initDb();

    if (req.method === "GET") {
      const result = await sql`
        SELECT id, title, category, body, author_name, replies, created_at
        FROM forum_topics
        ORDER BY created_at DESC
        LIMIT 100
      `;
      return sendJson(res, 200, { topics: result.rows });
    }

    if (req.method === "POST") {
      const user = await getUserFromRequest(req);
      if (!user) return sendJson(res, 401, { error: "Нужно войти в аккаунт." });

      const { title = "", category = "Общее", body = "" } = req.body || {};
      if (!String(title).trim() || !String(body).trim()) {
        return sendJson(res, 400, { error: "Заполните тему и сообщение." });
      }

      const id = makeId("top");
      await sql`
        INSERT INTO forum_topics (id, title, category, body, author_id, author_name)
        VALUES (${id}, ${String(title).trim()}, ${String(category)}, ${String(body).trim()}, ${user.id}, ${user.username})
      `;
      return sendJson(res, 201, { ok: true });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, { error: "Ошибка тем.", detail: error.message });
  }
};
