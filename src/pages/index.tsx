import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

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

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

type RegisterType = z.infer<typeof registerSchema>;

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: RegisterType) {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast({
        title: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }
    alert(JSON.stringify(data, null, 4));
  }

  return (
    <Layout>
      <Card className={cn("w-380px")}>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>필수 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="이름을 입력하세요." {...field} />
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
                      <Input placeholder="이메일을 입력하세요." {...field} />
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
                      <Input placeholder="연락처를 입력하세요." {...field} />
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
              <Button
                type="button"
                className={cn({ hidden: step === 1 })}
                onClick={() => {
                  form.trigger(["username", "email", "phone", "role"]);
                  const usernameState = form.getFieldState("username");
                  const phoneState = form.getFieldState("phone");
                  const emailState = form.getFieldState("email");
                  const roleState = form.getFieldState("role");

                  if (!usernameState.isDirty || usernameState.invalid) return;
                  if (!phoneState.isDirty || phoneState.invalid) return;
                  if (!emailState.isDirty || emailState.invalid) return;
                  if (!roleState.isDirty || roleState.invalid) return;

                  setStep(1);
                }}
              >
                다음 단계로
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}
