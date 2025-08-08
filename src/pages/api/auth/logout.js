// pages/api/auth/logout.js
import { serialize } from "cookie";

export default function handler(req, res) {
  // Borra las cookies de Spotify
  res.setHeader("Set-Cookie", [
    serialize("access_token", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }),
    serialize("refresh_token", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }),
    serialize("expires_at", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }),
  ]);
  // Redirige al home
  res.redirect("/");
}
