// pages/api/auth/callback.js

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

    // Puedes guardar estos tokens en sesión, cookies o una base de datos.
    console.log("Access Token:", data.access_token);
    console.log("Refresh Token:", data.refresh_token);

    // Por ahora, solo redirige al home con el token (esto lo mejoraremos luego)
    res.redirect(`/?access_token=${data.access_token}`);
  } catch (error) {
    console.error("Error al obtener tokens", error);
    res.status(500).send("Error al intercambiar el código");
  }
}
