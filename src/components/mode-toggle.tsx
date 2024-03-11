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

export function ModeToggle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [loginState, setLoginState] = useState<boolean>(false);
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setLoginState(true);
    });
  }, [router]);

  return (
    <div className={className} {...props}>
      {loginState && (
        <>
          <Button
            onClick={() => router.push("../product/ProductForm")}
            variant="outline"
          >
            상품페이지
          </Button>
          <Button
            onClick={async () => {
              await signOut(auth);
              setLoginState(false);
            }}
            variant="outline"
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
  );
}
