import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/validators/auth";
import { useState } from "react";
import { addrType } from "@/types/type";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RegisterType = z.infer<typeof registerSchema>;

interface FirstStepProps {
  form: UseFormReturn<RegisterType>;
  step: number;
  kakaoAddr: string;
  setKakaoAddr: (addr: string) => void;
}

const FirstStep = ({ form, kakaoAddr, setKakaoAddr, step }: FirstStepProps) => {
  const [postCode, setPostCode] = useState<string>("");

  const kakaoAddrModal = () => {
    if (!window.daum) {
      console.error("window.daum is not defined");
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data: addrType) {
        let selectedAddress = data.address;
        // 지번주소 선택 시 지번주소 저장
        if (data.userSelectedType === "J") {
          selectedAddress = data.jibunAddress;
        }
        setKakaoAddr(selectedAddress);
        setPostCode(data.zonecode);
      },
    }).open();
  };

  return (
    <motion.div
      className={cn("flex justify-between gap-10")}
      animate={{ translateX: `${step * -100}%` }}
      transition={{ ease: "easeInOut" }}
    >
      <div className="w-[250px]">
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
            <FormItem>
              <FormLabel>성별</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col"
                >
                  <div className="flex gap-1">
                    <FormControl>
                      <RadioGroupItem value="남성" id="gender-male" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="gender-male">
                      남
                    </FormLabel>

                    <FormControl>
                      <RadioGroupItem value="여성" id="gender-female" />
                    </FormControl>
                    <FormLabel className="font-normal" htmlFor="gender-female">
                      녀
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>생년월일</FormLabel>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="birthYear"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="년" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="min-w-[20px]">
                      {Array.from({ length: 114 }, (_, i) => 2024 - i).map(
                        (year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
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
              name="birthMonth"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="월" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="min-w-[10px]">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="일" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="min-w-[10px]">
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
        </div>
      </div>
      <div className="mt-0">
        {/* 주소 입력란 */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주소</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-3">
                  <Input
                    type="text"
                    value={kakaoAddr}
                    onClick={kakaoAddrModal}
                    className="min-w-[300px]"
                    readOnly
                  />
                  <Input
                    type="text"
                    value={postCode}
                    onClick={kakaoAddrModal}
                    readOnly
                  />
                  <Input
                    id="addrDetail"
                    placeholder="상세주소를 입력해 주세요."
                    {...field}
                  />
                  <Button type="button" onClick={kakaoAddrModal}>
                    주소 찾기
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {form.watch("role") === "admin" && (
          <FormField
            control={form.control}
            name="adminCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="관리자 코드 입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </motion.div>
  );
};

export default FirstStep;
