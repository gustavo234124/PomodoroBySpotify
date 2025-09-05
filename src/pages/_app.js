import "@/styles/globals.css";
import { BackgroundProvider } from "@/components/BackgroundContext";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <BackgroundProvider>
        <Component {...pageProps} />
      </BackgroundProvider>
    </SessionProvider>
  );
}