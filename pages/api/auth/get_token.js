// pages/api/auth/get_token.js
import { parse } from "cookie";

export default function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};

  if (!cookies.access_token) {
    return res.status(401).json({ error: "No access token" });
  }

  res.status(200).json({
    access_token: cookies.access_token,
    expires_at: cookies.expires_at,
  });
}
// Este endpoint devuelve el access token y su expiración