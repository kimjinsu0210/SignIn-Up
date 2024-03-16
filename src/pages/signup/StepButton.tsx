import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { UserType } from "@/types/type";
import { UseFormReturn } from "react-hook-form";
import { registerSchema } from "@/validators/auth";
import { z } from "zod";
import { useRouter } from "next/router";

type RegisterType = z.infer<typeof registerSchema>;

interface StepButtonProps {
  form: UseFormReturn<RegisterType>;
  step: number;
  kakaoAddr: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const StepButton = ({ form, step, kakaoAddr, setStep }: StepButtonProps) => {
  console.log("kakaoAddr :", kakaoAddr);
  const router = useRouter();

  const nextStepHandler = async () => {
    // 카카오 주소 조합
    // 카카오 주소 유효성 검사
    if (kakaoAddr === "") {
      toast({
        title: "주소를 선택해 주세요",
        variant: "destructive",
      });
      return;
    }
    form.setValue("address", `${kakaoAddr} ${form.watch("address")}`);

    const userData: (keyof UserType)[] = [
      "phone",
      "email",
      "username",
      "role",
      "gender",
      "birthYear",
      "birthMonth",
      "birthDay",
      "address",
    ];

    await form.trigger(userData);
    // 첫번째 Step 유효성 검사
    for (const field of userData) {
      const fieldState = form.getFieldState(field);
      if (!fieldState.isDirty || fieldState.invalid) return;
    }

    setStep(1);
  };

  return (
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
      <Button className={cn({ hidden: step === 0 })}>계정 등록하기</Button>
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
  );
};

export default StepButton;
