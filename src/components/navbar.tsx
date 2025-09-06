import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="group relative pb-1 text-sm font-medium">
            Home
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px w-full origin-center scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </Link>
          <Link
            href="https://bhavesh95182.gumroad.com/l/clerk-signin-signup-pages"
            target="_blank"
            className="group relative pb-1 text-sm font-medium"
          >
            Gumroad Link
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px w-full origin-center scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </Link>
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
}
