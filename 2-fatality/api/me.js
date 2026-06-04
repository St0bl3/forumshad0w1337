const { getUserFromRequest, sendJson } = require("./_lib/db");

module.exports = async function handler(req, res) {
  const user = await getUserFromRequest(req);
  if (!user) return sendJson(res, 401, { user: null });
  return sendJson(res, 200, { user });
};
