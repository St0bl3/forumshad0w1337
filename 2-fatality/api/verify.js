const { sql, initDb } = require("./_lib/db");

module.exports = async function handler(req, res) {
  try {
    await initDb();
    const token = String(req.query.token || "");
    const result = await sql`
      UPDATE forum_users
      SET email_verified = TRUE, verify_token = NULL, verify_expires = NULL
      WHERE verify_token = ${token} AND verify_expires > NOW()
      RETURNING username
    `;

    const ok = Boolean(result.rows.length);
    res.status(ok ? 200 : 400).setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <!doctype html>
      <html lang="ru">
        <head><meta charset="utf-8"><title>Pulse Forum</title></head>
        <body style="font-family:Arial,sans-serif;background:#07080d;color:#f6f8ff;display:grid;place-items:center;min-height:100vh">
          <div style="max-width:520px;padding:28px;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:rgba(255,255,255,.06)">
            <h1>${ok ? "Email подтвержден" : "Ссылка недействительна"}</h1>
            <p>${ok ? "Теперь можно войти в аккаунт и писать на форуме." : "Ссылка истекла или уже была использована."}</p>
            <a href="/" style="color:#50f3ff">Вернуться на форум</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).end("Verification error");
  }
};
