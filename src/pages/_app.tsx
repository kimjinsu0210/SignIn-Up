import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className={"min-h-screen"}>
        <Component {...pageProps} />
        <Toaster />
      </div>
      <ModeToggle className={"absolute top-6 right-6"} />
    </ThemeProvider>
  );
}
