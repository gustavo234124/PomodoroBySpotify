// pages/api/auth/login.js

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Lista de permisos para al usuario
const scopes = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-read", 
].join(" ");

export default function handler(req, res) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scopes,
    redirect_uri: redirect_uri,
  });

  // Redirige al usuario a la página de autenticación de Spotify
  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
