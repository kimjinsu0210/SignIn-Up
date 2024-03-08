# 프로젝트 명: Sign In & Up

Next.js 기반 로그인, 회원가입 페이지를 만들어 보았습니다.

UI를 구성하는 컴포넌트는 대부분 shadcn-ui 를 이용했고 회원가입 시 필요한 Form 및 유효성 검사는
React-hook-form과 Zod 를 이용해서 설계했습니다.<br>
백엔드로는 firebase의 auth, firestore(DB), storage를 사용해서 관리했습니다.

## 팀원

|  팀원  | 스택 |                깃허브 주소                |                블로그 주소                |
| :----: | :--: | :---------------------------------------: | :---------------------------------------: |
| 김진수 | `FE` | [GitHub](https://github.com/kimjinsu0210) | [Blog](https://kimjinsu0210.tistory.com/) |

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

## 기술 선정 이유

- Next.js

  - Next.js를 사용하여 React 기반의 웹 애플리케이션을 빠르고 쉽게 개발할 수 있습니다. Next.js는 SSR (서버 사이드 렌더링), CSR (클라이언트 사이드 렌더링), 정적 사이트 생성 및 API 라우팅을 지원하기 때문에 선정하게 되었습니다.

- Typescript

  - Compile 단계에서 Type Check를 통해 Human error를 방지하는 안정성 있는 개발 환경을 구성할 수 있어 선정하게 되었습니다.

- Shadcn/ui

  - shadcn/ui는 Tailwind CSS를 기반으로 한 리액트 UI 컴포넌트 라이브러리입니다. 이를 사용하면 반응형의 세련된 UI를 빠르게 구축할 수 있다는 장점이 있어 선정하게 되었습니다.

- Zod

  - Zod는 TypeScript를 위한 데이터 유효성 검사 및 스키마 정의 라이브러리입니다. 이 프로젝트에서는 Zod를 사용하여 데이터 모델을 정의하고 유효성을 검사하여 안정적이고 안전한 코드를 작성할 수 있어 유효성 검사 라이브러리로 선정하게 되었습니다.

- React Hook Form

  - React Hook Form은 리액트에서 폼을 관리하는 데 사용되는 간단하고 유연한 라이브러리입니다. 기존의 클래스형 컴포넌트나 다른 라이브러리에 비해 더 적은 코드로 폼을 구현할 수 있으며, 커스터마이징이 쉽다는 장점이 있어 선정하게 되었습니다.

- TailwindCSS

  - Inline에서 빠른 style의 작성, className의 작명을 생략해도 되어 개발 속도를 더욱 높일 수 있었으며 Styled-components처럼 code의 분량이 많아지지 않고, style을 추상화하여 한 눈에 파악할 수 있어 선정하게 되었습니다.

- Eslint

  - 코드의 품질, 보안 및 스타일 가이드 준수를 검사하는데 도움이 돼 선정하게 되었습니다.

- Firebase
  - 인증 및 보안: Firebase는 사용자 인증 및 보안을 관리하기 위한 다양한 도구를 제공합니다. 사용자 인증, OAuth, 사용자 그룹 관리 등의 기능을 통해 개발자는 보안적인 측면을 간단하게 관리할 수 있습니다.
  - 빠른 개발 및 배포: Firebase는 개발자가 빠르게 프로토타입을 개발하고 빠르게 배포할 수 있도록 도와줍니다. Firebase CLI를 사용하여 프로젝트를 초기화하고 배포할 수 있으며, Firebase의 다양한 기능들을 쉽게 사용할 수 있습니다.
    <br><br>이러한 이유들로 선정하게 되었습니다
