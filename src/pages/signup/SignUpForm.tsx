import { Layout } from "@/components/layout/Layout";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Form } from "@/components/ui/form";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { FirstStep, LastStep, StepButton } from "./index";
import { addCoupon, addUserInDB } from "@/pages/api/auth";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebaseSDK";

type RegisterType = z.infer<typeof registerSchema>;

const SignUpForm = () => {
  const [step, setStep] = useState<number>(0);
  const [kakaoAddr, setKakaoAddr] = useState<string>("");
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
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 계정 생성 핸들러
  const createUserHandler = async (data: RegisterType) => {
    // 비밀번호 유효성 검사
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast({
        title: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
        action: <ToastAction altText="Try again">다시 입력</ToastAction>,
      });
      return;
    }
    try {
      const nowTime = new Date();
      const discountRate = 20;
      const discountAmount = 5000;
      //auth 및 firestore 회원정보 저장
      await addUserInDB(data, nowTime);
      // coupon 관련 데이터 DB 저장
      await addCoupon("P", discountRate, data, nowTime);
      await addCoupon("F", discountAmount, data, nowTime);
      router.push("../user/UserCard");
      toast({
        title: "회원가입 완료",
      });
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        toast({
          title: "이미 존재하는 회원입니다.",
          variant: "destructive",
          action: <ToastAction altText="Try again">다시 입력</ToastAction>,
        });
      }
    }
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
              onSubmit={form.handleSubmit(createUserHandler)}
              className="relative overflow-x-hidden w-full"
            >
              {/* 첫번째 Step */}
              <FirstStep
                form={form}
                step={step}
                kakaoAddr={kakaoAddr}
                setKakaoAddr={setKakaoAddr}
              />
              {/* 두번째 Step */}
              <LastStep form={form} step={step} />
              {/* Step 처리 버튼 */}
              <StepButton
                form={form}
                step={step}
                kakaoAddr={kakaoAddr}
                setStep={setStep}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SignUpForm;
