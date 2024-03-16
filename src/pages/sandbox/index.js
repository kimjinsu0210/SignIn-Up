import { useEffect } from "react";
import { useRouter } from "next/router";
import { CheckoutPage, FailPage, SuccessPage } from "@/components/toss";

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
      {router.pathname === "/sandbox/" && <CheckoutPage />}
      {router.pathname === "/sandbox/success" && <SuccessPage />}
      {router.pathname === "/sandbox/fail" && <FailPage />}
    </div>
  );
}
