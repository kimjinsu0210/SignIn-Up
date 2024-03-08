import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/validators/auth";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { auth } from "./api/firebaseSDK";
import { Button } from "@/components/ui/button";

type RegisterType = z.infer<typeof registerSchema>;

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push("/user/UserCard");
    });
  }, [router]);

  const form = useForm<RegisterType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterType) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        toast({
          title: "로그인이 완료되었습니다",
        });
        router.push("/user/UserCard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const toastMessage: { [key: string]: string } = {
          "auth/invalid-credential": "이메일이나 비밀번호가 올바르지 않습니다.",
          "auth/missing-email": "이메일을 입력해 주세요.",
          "auth/invalid-email": "이메일 형식이 올바르지 않습니다.",
          "auth/missing-password": "비밀번호를 입력해 주세요.",
        };
        const errorMessage = toastMessage[errorCode];
        if (errorMessage) {
          toast({
            title: errorMessage,
            variant: "destructive",
          });
        }
      });
  };

  return (
    <Layout>
      <Card className={cn("w-[400px]")}>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative space-y-5 overflow-x-hidden"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이디</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="이메일 형식으로 입력해주세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              <div className={"flex justify-between gap-2"}>
                <Button type="submit">로그인</Button>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => router.push("/sign/SignUpForm")}
                >
                  회원가입
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}
