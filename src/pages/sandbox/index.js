// pages/index.js

import { useEffect } from "react";
import { useRouter } from "next/router";

// Import your page components here
import { SuccessPage } from "./Success.jsx";
import { FailPage } from "./Fail.jsx";
import { CheckoutPage } from "./Checkout.jsx";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Your custom logic for route change
      console.log("Route is changing to:", url);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <div>
      {/* Render your page components based on the route */}
      {router.pathname === "/sandbox/" && <CheckoutPage />}
      {router.pathname === "/sandbox/success" && <SuccessPage />}
      {router.pathname === "/sandbox/fail" && <FailPage />}
    </div>
  );
}
