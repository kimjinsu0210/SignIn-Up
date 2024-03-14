import { z } from "zod";
const numberRegex = /^[0-9]*$/;
export const paymentSchema = z.object({
  point: z.string().refine((value) => numberRegex.test(value), {
    message: "숫자만 입력해주세요.",
  }),
  deliveryMemo: z
    .string()
    .max(100, "배송 메모는 100자 이하만 입력이 가능합니다."),
  coupon: z.string(),
  receiptValue: z.string().refine((value) => numberRegex.test(value), {
    message: "숫자만 입력해주세요.",
  }),
});
