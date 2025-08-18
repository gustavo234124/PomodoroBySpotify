import "@/styles/globals.css";
import { BackgroundProvider } from "@/components/BackgroundContext";

export default function App({ Component, pageProps }) {
  return (
    <BackgroundProvider>
      <Component {...pageProps} />
    </BackgroundProvider>
  );
}