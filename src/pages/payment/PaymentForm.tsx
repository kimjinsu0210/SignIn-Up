import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../api/firebaseSDK";
import { UserType } from "@/types/type";
import { collection, getDocs } from "firebase/firestore";

const PaymentForm = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  console.log("userData :", userData);
  const router = useRouter();
  const { productImage, productName, productPrice } = router.query;

  useEffect(() => {
    // 인증 상태 변경시마다 실행되는 함수 설정
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
      else fetchData();
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
    // 현재 로그인한 사용자의 이메일 가져오기
    const currentUserEmail = auth.currentUser?.email;

    // 현재 사용자의 이메일과 일치하는 사용자만 필터링하여 fetchedUsers에 추가
    const filteredUser = fetchedUsers.find(
      (user) => user.email === currentUserEmail
    );

    // 필터링된 사용자 목록 설정
    if (filteredUser !== undefined) {
      setUserData(filteredUser);
    }
  };

  return (
    <div>
      <Accordion type="single" collapsible className="bg-[#dadada]">
        <AccordionItem value="item-1">
          <AccordionTrigger>배송지</AccordionTrigger>
          <AccordionContent>{userData?.email}</AccordionContent>
          <AccordionContent>{userData?.phone}</AccordionContent>
          <AccordionContent>{userData?.detailAddr}</AccordionContent>
        </AccordionItem>
      </Accordion>
      <CardHeader>
        <CardTitle>배송지</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardContent>
        <p>Card Content</p>
      </CardContent>

      <Card>
        <CardHeader>
          <CardTitle>주문자 정보</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>주문상품</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>쿠폰/포인트</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>최종 결제금액</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>결제수단</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>현금영수증</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>전체동의</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentForm;
