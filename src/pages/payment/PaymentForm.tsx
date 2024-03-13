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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../api/firebaseSDK";
import { PaymentType } from "@/types/type";
import { collection, getDocs } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const PaymentForm = () => {
  const [userData, setUserData] = useState<PaymentType | null>(null);
  const [directInput, setDirectInput] = useState<boolean>(false);
  const router = useRouter();
  const { productImage, productName, productPrice } = router.query;

  const form = useForm<PaymentType>({
    defaultValues: {
      deliveryMemo: "",
    },
  });
  console.log("form :", form.watch());

  const onSubmit = async (data: PaymentType) => {
    console.log("data :", data);
  };
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
    const fetchedUsers: PaymentType[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as PaymentType;
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative overflow-x-hidden w-full"
      >
        <div className="flex justify-center gap-10">
          <div className="flex flex-col gap-5 m-5 w-1/3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">주문자 정보</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="font-bold">{userData?.username}</p>
                <p className="text-gray-light">{userData?.phone}</p>
                <p className="text-[#767678]">{userData?.email}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">배송지</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pl-6">
                <p>{userData?.address}</p>
              </CardContent>
              <FormField
                control={form.control}
                name="deliveryMemo"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full p-5 pt-0">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === "직접 입력하기") {
                          setDirectInput(true);
                        } else {
                          setDirectInput(false);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="배송메모를 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="선택 안 함">선택 안 함</SelectItem>
                        <SelectItem value="직접 입력하기">
                          직접 입력하기
                        </SelectItem>
                        <SelectItem value="부재시 방수구에 넣어주세요">
                          부재시 방수구에 넣어주세요
                        </SelectItem>
                        <SelectItem value="문 앞에 놓아주세요">
                          문 앞에 놓아주세요
                        </SelectItem>
                        <SelectItem value="부재 시 연락 부탁드려요">
                          부재 시 연락 부탁드려요
                        </SelectItem>
                        <SelectItem value="배송 전 미리 연락해 주세요">
                          배송 전 미리 연락해 주세요
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {directInput && (
                      <FormControl>
                        <Textarea
                          placeholder="배송 메모를 입력해주세요"
                          className="resize-none"
                          value={
                            field.value === "직접 입력하기" ? "" : field.value
                          }
                          onChange={field.onChange}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">주문 상품</CardTitle>
              </CardHeader>
              <div className="flex">
                <CardContent>
                  <Image
                    src={
                      Array.isArray(productImage)
                        ? productImage[0]
                        : productImage || ""
                    }
                    alt="이미지"
                    width={100}
                    height={100}
                  />
                </CardContent>
                <CardContent className="p-0 pr-6">
                  <p>{productName}</p>
                  <p className="text-[#1088ED]">
                    {Number(productPrice)?.toLocaleString()}원
                  </p>
                </CardContent>
              </div>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">쿠폰/포인트</CardTitle>
              </CardHeader>
              <CardContent>
                <p>쿠폰</p>
                <FormField
                  control={form.control}
                  name="coupon"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="선택 안 함" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1000">1,000원 할인권</SelectItem>
                          <SelectItem value="3000">3,000원 할인권</SelectItem>
                          <SelectItem value="5000">5,000원 할인권</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardContent>
                <p>포인트</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">현금영수증</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>현금영수증 신청</p>
              </CardContent>
              <CardContent>
                <p>소득공제</p>
                <p>지출증빙</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-5 m-5 w-1/5">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">최종 결제금액</CardTitle>
              </CardHeader>
              <CardContent>
                <p>상품 가격</p>
                <p>쿠폰 할인</p>
                <p>포인트 사용</p>
                <p>배송비</p>
              </CardContent>
              <CardFooter>
                <p>총 결제금액</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">결제 방법</CardTitle>
              </CardHeader>
              <CardContent>
                <p>신용/체크카드</p>
                <p>무통장 입금</p>
                <p>핸드폰 결제</p>
                <p>카카오페이</p>
                <p>법인카드</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">전체동의</CardTitle>
              </CardHeader>
              <CardContent>
                <p>전체동의</p>
                <p>구매조건 확인 및 결제진행에 동의</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
