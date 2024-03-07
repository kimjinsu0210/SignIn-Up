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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validators/auth";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/router";

type RegisterInput = z.infer<typeof registerSchema>;

export const SignInForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      email: "",
      role: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  console.log("form :", form);

  const onSubmit = (data: RegisterInput) => {
    console.log("data :", data);
    toast({
      title: "비밀번호가 일치하지 않습니다.",
      variant: "destructive",
      duration: 1000,
    });
    alert(JSON.stringify(data, null, 4));
  };

  return (
    <Card className={cn("w-[400px]")}>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>필수 정보를 입력해주세요.</CardDescription>
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
  );
};
