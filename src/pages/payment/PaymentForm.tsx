import React from "react";
import { useRouter } from "next/router";

const PaymentForm = () => {
  const router = useRouter();
  const { productImage, productName, productPrice } = router.query;

  return <div>PaymentForm</div>;
};

export default PaymentForm;
