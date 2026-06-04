const { sql, initDb, makeId, hashPassword, sendJson } = require("./_lib/db");

async function sendVerifyEmail(email, username, verifyUrl) {
  if (!process.env.RESEND_API_KEY) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "Pulse Forum <onboarding@resend.dev>",
      to: email,
      subject: "Подтверждение аккаунта Pulse Forum",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Привет, ${username}!</h2>
          <p>Нажми кнопку ниже, чтобы подтвердить аккаунт на Pulse Forum.</p>
          <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 16px;background:#111;color:#fff;border-radius:8px;text-decoration:none">Подтвердить email</a></p>
          <p>Если кнопка не работает, открой ссылку: ${verifyUrl}</p>
        </div>
      `
    })
  });

  return response.ok;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    await initDb();
    const { username = "", email = "", password = "" } = req.body || {};
    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    if (cleanUsername.length < 3 || !cleanEmail.includes("@") || String(password).length < 4) {
      return sendJson(res, 400, { error: "Заполните ник, email и пароль." });
    }

    const existing = await sql`
      SELECT id FROM forum_users
      WHERE LOWER(username) = ${cleanUsername.toLowerCase()} OR email = ${cleanEmail}
      LIMIT 1
    `;
    if (existing.rows.length) return sendJson(res, 409, { error: "Такой никнейм или email уже есть." });

    const id = makeId("usr");
    const verifyToken = makeId("verify");
    const { salt, passwordHash } = hashPassword(String(password));
    const appUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    const verifyUrl = `${appUrl}/api/verify?token=${verifyToken}`;

    await sql`
      INSERT INTO forum_users (id, username, email, password_hash, salt, verify_token, verify_expires)
      VALUES (${id}, ${cleanUsername}, ${cleanEmail}, ${passwordHash}, ${salt}, ${verifyToken}, NOW() + INTERVAL '24 hours')
    `;

    const sent = appUrl ? await sendVerifyEmail(cleanEmail, cleanUsername, verifyUrl) : false;
    return sendJson(res, 201, {
      ok: true,
      message: sent
        ? "Аккаунт создан. Проверьте почту и подтвердите email."
        : "Аккаунт создан. Настройте RESEND_API_KEY, чтобы письма отправлялись автоматически.",
      verificationUrl: sent ? undefined : verifyUrl
    });
  } catch (error) {
    return sendJson(res, 500, { error: "Ошибка регистрации.", detail: error.message });
  }
};
