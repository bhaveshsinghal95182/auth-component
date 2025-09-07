import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-6 px-4 text-center">
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">Custom Clerk Auth Flows</h1>
        <p className="text-sm text-gray-600">
          This project provides reusable components and hooks to build custom
          authentication flows with Clerk, so you can avoid using Clerk&apos;s
          prebuilt UI components and fully control the look and behavior of your
          auth pages. The full source is available via the GitHub link in the
          navbar - and if you find this useful, donations are welcome on
          Gumroad.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button variant="outline">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
