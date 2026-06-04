const { sql } = require("@vercel/postgres");
const crypto = require("crypto");

let ready = false;

async function initDb() {
  if (ready) return;

  await sql`
    CREATE TABLE IF NOT EXISTS forum_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      verify_token TEXT,
      verify_expires TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS forum_topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      body TEXT NOT NULL,
      author_id TEXT REFERENCES forum_users(id),
      author_name TEXT NOT NULL,
      replies INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS forum_messages (
      id TEXT PRIMARY KEY,
      body TEXT NOT NULL,
      author_id TEXT REFERENCES forum_users(id),
      author_name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  ready = true;
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(12).toString("hex")}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return { salt, passwordHash };
}

function verifyPassword(password, user) {
  const { passwordHash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(passwordHash, "hex"), Buffer.from(user.password_hash, "hex"));
}

function signToken(user) {
  const secret = process.env.AUTH_SECRET || process.env.POSTGRES_URL || "dev-secret-change-me";
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    username: user.username,
    email: user.email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const secret = process.env.AUTH_SECRET || process.env.POSTGRES_URL || "dev-secret-change-me";
  const [payload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (Date.now() > data.exp) return null;
  return data;
}

async function getUserFromRequest(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = verifyToken(token);
  if (!session) return null;
  await initDb();
  const result = await sql`SELECT id, username, email, email_verified FROM forum_users WHERE id = ${session.id} LIMIT 1`;
  return result.rows[0] || null;
}

function sendJson(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

module.exports = {
  sql,
  initDb,
  makeId,
  hashPassword,
  verifyPassword,
  signToken,
  getUserFromRequest,
  sendJson
};
