import { serialize } from "cookie";

export default async function handler(req, res) {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send("No authorization code provided");
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
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }).toString(),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    const expiresAt = Date.now() + data.expires_in * 1000; // timestamp en ms

    // Guardamos access_token, refresh_token y expires_at en cookies httpOnly
    res.setHeader("Set-Cookie", [
      serialize("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: data.expires_in,
        path: "/",
        sameSite: "lax",
      }),
      serialize("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // refreshtoken 30 días
        path: "/",
        sameSite: "lax",
      }),
      serialize("expires_at", expiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: data.expires_in,
        path: "/",
        sameSite: "lax",
      }),
    ]);

    res.redirect("/");
  } catch (error) {
    console.error("Error al obtener tokens", error);
    res.status(500).send("Error al intercambiar el código");
  }
}
