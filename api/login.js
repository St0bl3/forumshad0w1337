const { sql, initDb, verifyPassword, signToken, sendJson } = require("./_lib/db");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    await initDb();
    const { login = "", password = "" } = req.body || {};
    const cleanLogin = String(login).trim().toLowerCase();
    const result = await sql`
      SELECT * FROM forum_users
      WHERE LOWER(username) = ${cleanLogin} OR email = ${cleanLogin}
      LIMIT 1
    `;
    const user = result.rows[0];

    if (!user || !verifyPassword(String(password), user)) {
      return sendJson(res, 401, { error: "Неверный логин или пароль." });
    }

    if (!user.email_verified) {
      return sendJson(res, 403, { error: "Сначала подтвердите email." });
    }

    return sendJson(res, 200, {
      token: signToken(user),
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    return sendJson(res, 500, { error: "Ошибка входа.", detail: error.message });
  }
};
