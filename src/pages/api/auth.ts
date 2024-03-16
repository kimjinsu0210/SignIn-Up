import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebaseSDK";
import { registerSchema } from "@/validators/auth";
import { z } from "zod";

type RegisterType = z.infer<typeof registerSchema>;

export const addUserInDB = async (data: RegisterType, nowTime: Date) => {
  createUserWithEmailAndPassword(auth, data.email, data.password);
  await addDoc(collection(db, "users"), {
    username: data.username,
    email: data.email,
    phone: data.phone,
    birth: `${data.birthYear}-${data.birthMonth}-${data.birthDay}`,
    gender: data.gender,
    role: data.role,
    address: data.address,
    point: 10000,
    regDate: nowTime,
  });
};

export const addCoupon = async (
  type: string,
  discount: number,
  data: RegisterType,
  nowTime: Date
) => {
  await addDoc(collection(db, "coupon"), {
    type,
    couponName: type === "P" ? "신규회원 쿠폰 20% 할인" : "5000원 할인권",
    discount: type === "P" ? discount : null,
    discountAmount: type === "P" ? null : discount,
    userEmail: data.email,
    createTime: nowTime,
  });
};
