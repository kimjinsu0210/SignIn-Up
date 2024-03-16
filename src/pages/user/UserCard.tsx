import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Layout } from "@/components/layout/Layout";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { UserType } from "@/types/type";
import { auth, db } from "@/pages/api/firebaseSDK";

const UserCard = () => {
  const loginEmail = auth.currentUser?.email;
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const fetchedUsers: UserType[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserType;
      fetchedUsers.push(userData);
    });
    setUsers(fetchedUsers);
  };

  return (
    <Layout>
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {users.map((user, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card
                  className={loginEmail === user.email ? "bg-[#B4C8BB]" : ""}
                >
                  <CardContent className="flex items-center justify-center p-4">
                    <span className="font-semibold">{user.username}</span>
                  </CardContent>
                  <CardContent className="flex items-center justify-center p-4">
                    <span className="font-semibold">{user.gender}</span>
                  </CardContent>
                  <CardContent className="flex items-center justify-center p-4">
                    <span className="font-semibold">{user.email}</span>
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
