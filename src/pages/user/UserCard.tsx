import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Layout } from "@/components/layout/Layout";
import { auth, db } from "../api/firebaseSDK";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";

const UserCard = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
    });
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    };
    fetchData();
  }, [router]);

  return (
    <Layout>
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[200px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1 md:basis-1/2 w-full">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Layout>
  );
};

export default UserCard;
