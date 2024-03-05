import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <Layout>
      <Card className={cn("w-380px")}>
        <CardHeader>
          <CardTitle>계정을 생성합니다</CardTitle>
          <CardDescription>필수 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div>
              <label htmlFor="name" className="block mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2">
                연락처
              </label>
              <input
                type="tel"
                id="phone"
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block mb-2">
                역할
              </label>
              <select
                id="role"
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="admin">관리자</option>
                <option value="user">일반사용자</option>
              </select>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              다음 단계로
            </button>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
