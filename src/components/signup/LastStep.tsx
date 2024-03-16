import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { registerSchema } from "@/validators/auth";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

type RegisterType = z.infer<typeof registerSchema>;

interface LastStepProps {
  form: UseFormReturn<RegisterType>;
  step: number;
}
const LastStep = ({ form, step }: LastStepProps) => {
  const pasteHandler = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    toast({
      title: "붙여넣기를 할 수 없습니다.",
      variant: "destructive",
    });
  };

  return (
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
  );
};

export default LastStep;
