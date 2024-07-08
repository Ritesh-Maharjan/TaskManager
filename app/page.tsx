import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex min-h-screen sm:-mt-14 flex-col justify-center items-center">
      <div className="space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold drop-shadow-md",
            font.className
          )}
        >
          Task Manager
        </h1>
        <p className="text-lg">
          A simple task manager site made to be used by friends
        </p>
        <div>
          <Link
            href={"/auth/login"}
            className={buttonVariants({ variant: "default" })}
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
