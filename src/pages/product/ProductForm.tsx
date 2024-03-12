import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../api/firebaseSDK";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { ProductType } from "@/types/type";
import Image from "next/image";

const ProductForm = () => {
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
    <div className="flex flex-wrap mt-24 ml-60">
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
              },
            });
          }}
        >
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
          <CardContent>
            <p>{data.productPrice}원</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductForm;
