// pages/index.js

import { useEffect } from "react";
import { useRouter } from "next/router";

// Import your page components here
import { SuccessPage } from "../../components/Success.jsx";
import { FailPage } from "../../components/Fail.jsx";
import { CheckoutPage } from "../../components/Checkout.jsx";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
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
