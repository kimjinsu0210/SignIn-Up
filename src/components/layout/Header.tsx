import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/pages/api/firebaseSDK";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const Header = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [loginState, setLoginState] = useState<boolean>(false);
  console.log("loginState :", loginState);
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (resolvedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    onAuthStateChanged(auth, (user) => {
      if (user) setLoginState(true);
    });
  }, [resolvedTheme]);

  return (
    <div
      className={`flex justify-around items-center h-20 gap-3 p-6 ${
        resolvedTheme === "dark" ? "bg-gray-900" : "bg-white"
      } ${className}`}
      {...props}
    >
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/next-signup-in.appspot.com/o/image%2FprojectIcon.png?alt=media&token=3295976b-8d5e-49dd-8c0b-b6f1a3751d27"
          alt="이미지"
          width={45}
          height={45}
        />
      </div>
      <div className="flex justify-center gap-3">
        {loginState && (
          <>
            <Button
              onClick={() => router.push("../product/ProductCard")}
              variant="outline"
            >
              상품페이지
            </Button>
            <Button
              onClick={() => router.push("../user/UserCard")}
              variant="outline"
            >
              유저페이지
            </Button>
            <Button
              onClick={async () => {
                await signOut(auth);
                setLoginState(false);
              }}
              variant="destructive"
            >
              로그아웃
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
