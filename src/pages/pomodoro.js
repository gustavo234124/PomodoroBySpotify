import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Pomodoro() {
  const router = useRouter();
  const { token } = router.query;
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (token) setAccessToken(token);
  }, [token]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-4">
      <h1 className="text-3xl mb-6">Aquí irá el Pomodoro después del login 🎧⏱️</h1>
      {accessToken ? (
        <p className="break-words max-w-md">
          <strong>Access Token:</strong> {accessToken}
        </p>
      ) : (
        <p>Cargando token...</p>
      )}
    </div>
  );
}
