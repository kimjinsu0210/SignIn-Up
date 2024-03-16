import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

import {
  Card,
  CardContent,
  CardDescription,
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

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { auth, db } from "../api/firebaseSDK";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { UserType, addrType } from "@/types/type";
import SignUpFirstStep from "./SignUpFirstStep";

type RegisterType = z.infer<typeof registerSchema>;

const SignUpForm = () => {
  const [step, setStep] = useState<number>(0);
  const [kakaoAddr, setKakaoAddr] = useState<string>("");
  // const [postCode, setPostCode] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // 카카오 API 주소 script 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    // 로그인 상태일 때 router
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("../user/UserCard");
    });

    // Cleanup 함수
    return () => {
      document.body.removeChild(script);
      unsubscribe();
    };
  }, [router]);

  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      role: "",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      gender: "",
      detailAddr: "",
      password: "",
      confirmPassword: "",
    },
  });
  // 계정 생성 핸들러
  const onSubmit = async (data: RegisterType) => {
    // 비밀번호 비교 로직
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast({
        title: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
        action: <ToastAction altText="Try again">다시 입력</ToastAction>,
      });
      return;
    }
    //auth 및 firestore 생성
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async () => {
        const nowTime = serverTimestamp();
        await addDoc(collection(db, "users"), {
          username: data.username,
          email: data.email,
          phone: data.phone,
          birth: `${data.birthYear}-${data.birthMonth}-${data.birthDay}`,
          gender: data.gender,
          role: data.role,
          address: `${kakaoAddr} ${data.detailAddr}`,
          point: 10000,
          regDate: nowTime,
        });
        // 신규회원 쿠폰 부여 로직
        // 쿠폰 type에서 P는 정률제 F는 정액제 약자
        const type = "P";
        const type2 = "F";
        const discount = 20;
        const discount2 = 5000;
        await addDoc(collection(db, "coupon"), {
          type,
          couponName: "신규회원 쿠폰 20% 할인",
          discount: type === "P" ? discount : null,
          discountAmount: type === "P" ? null : discount,
          userEmail: data.email,
          createTime: nowTime,
        });
        await addDoc(collection(db, "coupon"), {
          type: type2,
          couponName: "5000원 할인권",
          discount: type2 === "F" ? null : discount2,
          discountAmount: type2 === "F" ? discount2 : null,
          userEmail: data.email,
          createTime: nowTime,
        });
        toast({
          title: "회원가입 완료",
        });
      })
      .catch((error) => {
        //auth 유효성 검사
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          toast({
            title: "이미 존재하는 회원입니다.",
            variant: "destructive",
            action: <ToastAction altText="Try again">다시 입력</ToastAction>,
          });
          return;
        }
      });
  };
  // 다음 단계 핸들러
  const nextStepHandler = async () => {
    // 카카오 주소 유효성 검사
    if (kakaoAddr === "") {
      toast({
        title: "주소를 선택해 주세요",
        variant: "destructive",
      });
      return;
    }

    const userData: (keyof UserType)[] = [
      "phone",
      "email",
      "username",
      "role",
      "gender",
      "birthYear",
      "birthMonth",
      "birthDay",
      "detailAddr",
    ];

    await form.trigger(userData);
    // 카카오 주소와 비밀번호를 제외한 form 데이터 유효성 검사
    for (const field of userData) {
      const fieldState = form.getFieldState(field);
      if (!fieldState.isDirty || fieldState.invalid) return;
    }

    setStep(1);
  };

  const pasteHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    toast({
      title: "붙여넣기를 할 수 없습니다.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <Card className={cn("w-full")}>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>필수 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative overflow-x-hidden w-full"
            >
              {/* 첫번째 Step */}
              <SignUpFirstStep
                form={form}
                kakaoAddr={kakaoAddr}
                setKakaoAddr={setKakaoAddr}
                step={step}
              />
              <motion.div
                className={cn("absolute top-0 left-0 right-0")}
                animate={{ translateX: `${(1 - step) * 100}%` }}
                style={{ translateX: `${(1 - step) * 100}%` }}
                transition={{
                  ease: "easeInOut",
                }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input type={"password"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호 확인</FormLabel>
                      <FormControl>
                        <Input
                          type={"password"}
                          {...field}
                          onPaste={(event) => pasteHandler(event)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <div className={"flex justify-between gap-2 pt-5"}>
                <Button
                  type="button"
                  className={cn({ hidden: step === 1 })}
                  onClick={nextStepHandler}
                >
                  다음 단계로
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  className={cn({ hidden: step === 1 })}
                  type="button"
                  variant={"outline"}
                  onClick={() => router.push("/")}
                >
                  로그인 페이지로
                </Button>
                <Button className={cn({ hidden: step === 0 })} type="submit">
                  계정 등록하기
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn({ hidden: step === 0 })}
                  onClick={() => {
                    setStep(0);
                  }}
                >
                  이전 단계로
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SignUpForm;
