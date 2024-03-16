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
import { useRouter } from "next/router";
import { auth, db } from "../../api/firebaseSDK";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { UserType } from "@/types/type";
import { FirstStep, LastStep, StepButton } from "./index";

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
      if (user) router.push("../../user/UserCard");
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
              <FirstStep
                form={form}
                step={step}
                kakaoAddr={kakaoAddr}
                setKakaoAddr={setKakaoAddr}
              />
              {/* 마지막 Step */}
              <LastStep form={form} step={step} />
              {/* Step 버튼 */}
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
