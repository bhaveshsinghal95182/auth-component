import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorSuccessMessages } from "@/components/error-success-messages";
import { useSignUpHandlers } from "@/hooks/sign-up/use-signup-flow";
import { z } from "zod";
import { OAuthButtons } from "../oauth-button";
import { useSignInHandlers } from "@/hooks/sign-in/use-sign-in";
import { PasswordInput } from "../ui/password-input";
import Link from "next/link";

export function SignUpForm() {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const { error, verifying, signUpWithEmail, verifyCode, setError } =
    useSignUpHandlers();
  const { signInWith } = useSignInHandlers();

  // Zod schemas
  const signupSchema = z.object({
    emailAddress: z.email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
  });
  const codeSchema = z
    .string()
    .min(4, { message: "Code must be at least 4 characters." });

  // Step 1: Sign up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear previous errors
    setError("");
    const result = signupSchema.safeParse({ emailAddress, password });
    if (!result.success) {
      // Use the shared setError to display validation messages consistently
      const message = result.error.issues.map((err) => err.message).join(" ");
      setError(message);
      return;
    }
    signUpWithEmail(emailAddress, password);
  };

  // Step 2: Verify code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = codeSchema.safeParse(code);
    if (!result.success) {
      const message = result.error.issues.map((err) => err.message).join(" ");
      setError(message);
      return;
    }
    verifyCode(code);
  };

  // Combine errors
  const allErrors = [...(error ? [{ code: "api_error", message: error }] : [])];

  return (
    <div className="w-full max-w-sm mx-auto">
      <ErrorSuccessMessages errors={allErrors} />
      {!verifying ? (
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Label htmlFor="emailAddress">Email</Label>
          <Input
            id="emailAddress"
            type="email"
            placeholder="Enter your email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />
          <Label htmlFor="password">Password</Label>
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            placeholder="Enter code from email"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      )}
      <div className="flex flex-col gap-4 mt-4">
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <OAuthButtons signInWith={signInWith} />
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-in" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}
