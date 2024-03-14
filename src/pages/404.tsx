import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없습니다.</h1>
      <p className="text-lg mb-8">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link href="/" className="bg-gray-light border rounded-md p-5 font-bold">
        홈페이지로 이동
      </Link>
    </div>
  );
};

export default Custom404;
