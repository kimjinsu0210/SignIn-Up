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
import { collection, getDocs, query, where } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const PaymentForm = () => {
  const [userData, setUserData] = useState<PaymentType | null>(null);
  const [couponData, setCouponData] = useState<PaymentType[]>([]);
  console.log("userData :", userData);
  console.log("couponData :", couponData);
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
      fetchData();
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    // 현재 로그인한 사용자의 이메일 가져오기
    const currentUser = auth.currentUser;
    if (currentUser) {
      const currentUserEmail = currentUser.email;
      // 사용자 데이터 가져오기
      const userQuerySnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", currentUserEmail))
      );
      if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data() as PaymentType;
        setUserData(userData);
      }

      // 쿠폰 데이터 가져오기
      const couponQuerySnapshot = await getDocs(
        query(
          collection(db, "coupon"),
          where("userEmail", "==", currentUserEmail)
        )
      );
      const couponDataArray: PaymentType[] = [];
      couponQuerySnapshot.forEach((doc) => {
        const couponData = doc.data() as PaymentType;
        couponDataArray.push(couponData);
      });

      setCouponData(couponDataArray);
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
                <p className="text-gray-light">{userData?.email}</p>
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
                <p>보유 쿠폰</p>
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
                          {couponData.map((data) => (
                            <SelectItem
                              key={data.id}
                              value={
                                data.type === "P"
                                  ? String(data.discount)
                                  : String(data.discountAmount)
                              }
                            >
                              {data.couponName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <CardDescription>
                        쿠폰은 총 결제금액 10000원 이상부터 사용 가능합니다
                      </CardDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardContent>
                <p>포인트</p>
                <FormField
                  control={form.control}
                  name="point"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p>
                  보유 포인트{" "}
                  <span className="font-bold">{userData?.point}</span>
                </p>
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
