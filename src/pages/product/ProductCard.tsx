import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../api/firebaseSDK";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { ProductType } from "@/types/type";
import Image from "next/image";

const ProductCard = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
      else fetchData();
    });
  }, [router]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const fetchedProducts: ProductType[] = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data() as ProductType;
      fetchedProducts.push(productData);
    });
    setProducts(fetchedProducts);
  };

  return (
    <>
      <div className="flex justify-center mt-10">
        <h1 className="text-3xl font-bold text-gray-light">상품 페이지</h1>
      </div>
      <div className="flex flex-wrap mt-10 ml-60">
        {products.map((data, index) => (
          <Card
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 m-2 p-2 cursor-pointer"
            onClick={() => {
              router.push({
                pathname: "../payment/PaymentForm",
                query: {
                  productImage: data.productImage,
                  productName: data.productName,
                  productPrice: data.productPrice,
                  deliveryCost: data.deliveryCost,
                },
              });
            }}
          >
            <div className="flex flex-col justify-between h-full">
              <CardHeader>
                <div>
                  <Image
                    src={data.productImage}
                    alt="이미지"
                    width={400}
                    height={300}
                  />
                </div>
                <CardTitle className="text-lg">{data.productName}</CardTitle>
              </CardHeader>
              <CardContent className="flex text-end">
                <div>
                  <p>상품 가격</p>
                  <p>배송비</p>
                </div>
                <div className="ml-3">
                  <p>{data.productPrice.toLocaleString()}원</p>
                  <p>{data.deliveryCost.toLocaleString()}원</p>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ProductCard;
