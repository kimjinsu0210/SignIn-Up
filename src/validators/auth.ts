import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const phoneRegex = /^010\d{8}$/;

export const registerSchema = z.object({
  email: z.string().email({ message: "이메일 형식에 맞춰 입력해주세요." }),
  phone: z
    .string()
    .min(11, "연락처는 11자리여야 합니다.")
    .max(11, "연락처는 11자리여야 합니다.")
    .refine(
      (value) => phoneRegex.test(value),
      "010으로 시작하는 11자리 숫자를 입력해주세요"
    ),
  username: z
    .string()
    .min(2, { message: "이름은 2글자 이상이어야 합니다." })
    .max(100, { message: "이름은 100글자 이하이어야 합니다." }),
  role: z.string().min(2, { message: "역할을 선택해주세요." }),
  gender: z.string().min(1, { message: "성별을 체크해주세요." }),
  birthYear: z.string().min(1, { message: "년을 선택해주세요" }),
  birthMonth: z.string().min(1, { message: "월을 선택해주세요" }),
  birthDay: z.string().min(1, { message: "일을 선택해주세요" }),
  address: z.string().min(1, { message: "상세주소를 입력해 주세요." }),
  password: z
    .string()
    .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
    .max(100, "비밀번호는 100자리 이하이어야 합니다.")
    .refine(
      (value) => passwordRegex.test(value),
      "비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
    ),
  confirmPassword: z
    .string()
    .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
    .max(100, "비밀번호는 100자리 이하이어야 합니다.")
    .refine(
      (value) => passwordRegex.test(value),
      "비밀번호는 최소 6자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
    ),
  adminCode: z
    .string()
    .min(1, { message: "관리자 코드를 입력해주세요" })
    .refine(
      (value) => value === "admin1234",
      "관리자 코드가 일치하지 않습니다."
    ),
});
