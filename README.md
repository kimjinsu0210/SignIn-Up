# 프로젝트 명: Sign In & Up

Next.js Typescript tailwindCSS 기반의 로그인, 회원가입 페이지를 만들어봤습니다.<br>
로그인 시 회원정보들이 담긴 carousel 기반의 카드가 나오게 됩니다.<br><br>
UI를 구성하는 컴포넌트는 shadcn-ui 를 이용했고 회원가입 시 필요한 Form 및 유효성 검사는
React-hook-form과 Zod를 이용해서 설계했습니다.<br><br>
백엔드로는 firebase의 auth, firestore(DB) 이용했습니다.

## 프로젝트 설정 및 실행

1. 프로젝트 클론 후 아래 명령어를 입력을 통해 프로젝트를 실행할 수 있습니다.

```
# 의존성 패키지 설치
yarn install

# 개발 서버 실행
yarn start or yarn dev
```

## 기술 스택

### Framework & Library

<div className="flex">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white">
<img src="https://img.shields.io/badge/Next.js-14.1.1-black?style=for-the-badge&logo=next.js&logoColor=black">
<img src="https://img.shields.io/badge/React%20Hook%20Form-FFC0CB?style=for-the-badge&logo=react&logoColor=black">

![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-8A2BE2?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-4958CC?style=for-the-badge&logo=&logoColor=white)

### Langauge & CSS Framwork

<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
</div>

### Tools

<img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white">

### Back-end

<img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase">

## 프로젝트 구조

프로젝트 설명에 앞서 프로젝트 구조를 이해하는 것이 중요합니다.

@/components/ui: 이 디렉토리에는 카드, 버튼, 양식, 선택, 입력 및 기타 관련 구성 요소와 같은 사용자 정의 UI 구성 요소가 포함되어 있습니다.</br>
@/libcn: (className) 함수와 같은 유틸리티 함수가 저장되는 곳입니다.</br>
@/validators: 이 디렉터리에는 인증(auth)을 위한 유효성 검사 스키마가 있습니다.</br>

## shadcn-ui 구성요소 가져오기

@components/ui/...에 저장된 컴포넌트를 가져옵니다. UI 컴포넌트로는 button, card, input, form, select, toast 등이 있습니다.

```
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ... other imports
```

## Form 처리 설정

사전 정의된 스키마( )에 대해 Form 데이터의 유효성을 검사하기 위해 useForm를 사용합니다 .

```
const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      // ... other default values
    },
});
```

## Form 필드

Form 필드는 Form 상태 관리를 위한 prop, Form 필드를 식별하는 prop 및 실제 입력 요소를 렌더링하는 prop을 FormField허용하는 구성 요소 내에서 정의됩니다.

```
<FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>이름</FormLabel>
      <FormControl>
        <Input placeholder="홍길동" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
// ... other form fields
```

## Form Submit

단계 간 이동, Form 유효성 검사 트리거, Form 데이터 제출을 위한 버튼이 제공됩니다.

```
<div className={"flex gap-2"}>
  <Button className={cn({ hidden: step === 0 })} type="submit">
    계정 등록하기
  </Button>
  // ... other buttons for navigation
</div>
```

Form의 각 섹션과 컨트롤은 구조화된 사용자 입력 흐름을 지원하여 지정된 유효성 검사 규칙을 준수하면서 필요한 정보가 사용자 친화적인 방식으로 수집되도록 했습니다.
