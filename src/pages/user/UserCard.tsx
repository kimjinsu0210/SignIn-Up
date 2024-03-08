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

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
    });

    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers: UserType[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserType;
        fetchedUsers.push(userData);
      });
      setUsers(fetchedUsers);
    };
    fetchData();
  }, [router]);

  return (
    <Layout>
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
                <Card>
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
