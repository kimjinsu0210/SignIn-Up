declare global {
  interface Window {
    daum: any;
  }
}

export interface addrType {
  address: string;
  jibunAddress: string;
  zonecode: string;
  userSelectedType: string;
}

export interface UserType {
  username: string;
  email: string;
  phone: string;
  role: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
  detailAddr: string;
}

export interface ProductType {
  productNum: number;
  productImage: string;
  productName: string;
  productPrice: number;
}

export interface PaymentType {
  username: string;
  email: string;
  phone: string;
  address: string;
  deliveryMemo: string;
  coupon: string;
  couponNumber: string;
}
