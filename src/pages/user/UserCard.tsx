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
import { auth, db } from "../api/firebaseSDK";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { UserType } from "@/types/type";
import Autoplay from "embla-carousel-autoplay";

const UserCard = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loginEmail, setLoginEmail] = useState<string | null>("");

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setLoginEmail(user.email);
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
      <h1 className="text-lg font-bold text-center mb-5">
        가입된 회원들의 모든 정보입니다.
        <br />
        로그인된 회원은 녹색으로 표시됩니다.
      </h1>
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-xs"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
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
