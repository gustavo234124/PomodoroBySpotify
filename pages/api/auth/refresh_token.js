// pages/api/auth/refresh_token.js
import { serialize, parse } from "cookie";

export default async function handler(req, res) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const refresh_token = cookies.refresh_token;

  if (!refresh_token) {
    return res.status(401).json({ error: "No refresh token found" });
  }

  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }).toString(),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    // Actualizamos la cookie con el nuevo access token
    res.setHeader("Set-Cookie", serialize("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
      sameSite: "lax",
    }));

    // Respondemos con el nuevo access token para que el cliente lo use si quiere
    res.status(200).json({ access_token: data.access_token });
  } catch (error) {
    console.error("Error refreshing token", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
}
