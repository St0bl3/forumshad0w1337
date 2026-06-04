const { sql, initDb, makeId, getUserFromRequest, sendJson } = require("./_lib/db");

module.exports = async function handler(req, res) {
  try {
    await initDb();

    if (req.method === "GET") {
      const result = await sql`
        SELECT id, body, author_name, created_at
        FROM forum_messages
        ORDER BY created_at ASC
        LIMIT 80
      `;
      return sendJson(res, 200, { messages: result.rows });
    }

    if (req.method === "POST") {
      const user = await getUserFromRequest(req);
      if (!user) return sendJson(res, 401, { error: "Нужно войти в аккаунт." });

      const { body = "" } = req.body || {};
      if (!String(body).trim()) return sendJson(res, 400, { error: "Введите сообщение." });

      const id = makeId("msg");
      await sql`
        INSERT INTO forum_messages (id, body, author_id, author_name)
        VALUES (${id}, ${String(body).trim()}, ${user.id}, ${user.username})
      `;
      return sendJson(res, 201, { ok: true });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, { error: "Ошибка чата.", detail: error.message });
  }
};
