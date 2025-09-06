import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen gap-4">
      <Button variant="outline">
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button variant="outline">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
