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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/router";
import { auth, db } from "../api/firebaseSDK";
import { addDoc, collection } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { UserType, addrType } from "@/types/type";

type RegisterType = z.infer<typeof registerSchema>;

const SignUpForm = () => {
  const [step, setStep] = useState<number>(0);
  const [kakaoAddr, setKakaoAddr] = useState<string>("");
  const [postCode, setPostCode] = useState<string>("");

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push("../user/UserCard");
    });
  }, [router]);

  //카카오 API 주소 script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const onSubmit = async (data: RegisterType) => {
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
        await addDoc(collection(db, "users"), {
          username: data.username,
          email: data.email,
          phone: data.phone,
          birth: `${data.birthYear}-${data.birthMonth}-${data.birthDay}`,
          gender: data.gender,
          role: data.role,
          address: `${kakaoAddr} ${data.detailAddr}`,
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
        }
      });
  };

  const formValidationHandler = async () => {
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
    // 카카오 주소 유효성 검사
    if (kakaoAddr === "") {
      toast({
        title: "주소를 선택해 주세요",
        variant: "destructive",
      });
      return;
    }

    await form.trigger(userData);
    // form 데이터 유효성 검사
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

  const kakaoAddrModal = () => {
    if (window.daum) {
      new window.daum.Postcode({
        oncomplete: function (data: addrType) {
          setKakaoAddr(data.address);
          setPostCode(data.zonecode);
        },
      }).open();
    } else {
      console.error("window.daum is not defined");
    }
  };

  return (
    <Layout>
      <Card className={cn("w-[400px]")}>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>필수 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative space-y-3 overflow-x-hidden"
            >
              <motion.div
                className={cn("space-y-3")}
                animate={{ translateX: `${step * -100}%` }}
                transition={{ ease: "easeInOut" }}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="이름을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input placeholder="이메일을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처</FormLabel>
                      <FormControl>
                        <Input placeholder="010-XXXX-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>성별</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="남성" />
                            </FormControl>
                            <FormLabel className="font-normal">남</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="여성" />
                            </FormControl>
                            <FormLabel className="font-normal">녀</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-5">
                  <FormField
                    control={form.control}
                    name="birthYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>년</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="년" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from(
                              { length: 114 },
                              (_, i) => 2024 - i
                            ).map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>월</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="월" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (month) => (
                                <SelectItem key={month} value={String(month)}>
                                  {String(month)}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>일</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="일" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <SelectItem key={day} value={String(day)}>
                                  {day}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* 주소 입력란 */}
                <FormField
                  control={form.control}
                  name="detailAddr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주소</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-3">
                          <Input
                            type="text"
                            value={kakaoAddr}
                            readOnly
                            onClick={kakaoAddrModal}
                          />
                          <Input type="text" value={postCode} readOnly />
                          <Input
                            id="addrDetail"
                            placeholder="상세주소를 입력해 주세요."
                            {...field}
                          />
                          <Button type="button" onClick={kakaoAddrModal}>
                            검색
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>역할</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="역할을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">관리자</SelectItem>
                          <SelectItem value="user">사용자</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                className={cn("space-y-3 absolute top-0 left-0 right-0")}
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
                  onClick={formValidationHandler}
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
