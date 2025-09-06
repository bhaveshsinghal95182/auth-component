import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { OAuthButtons } from "@/components/oauth-button";
import { ErrorSuccessMessages } from "@/components/error-success-messages";
import { z } from "zod";
import { OAuthStrategy } from "@clerk/types";
import { ClerkAPIError } from "@clerk/types";
import { PasswordInput } from "../ui/password-input";
import Link from "next/link";

interface SignInFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isSubmitting: boolean;
  errors?: ClerkAPIError[];
  setErrors?: (errors?: ClerkAPIError[] | undefined) => void;
  handleSubmit: (e: React.FormEvent) => void;
  signInWith: (provider: OAuthStrategy) => void;
  forgotPasswordCode: (email: string) => void;
}

export function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  errors,
  setErrors,
  handleSubmit,
  signInWith,
  forgotPasswordCode,
}: SignInFormProps) {
  // Use central errors via props.setErrors when available

  // Zod schemas
  const loginSchema = z.object({
    email: z.email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
  });
  const emailSchema = z.email({
    message: "Please enter a valid email address.",
  });

  // Validate login before submit
  const handleValidatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors && setErrors(undefined);
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors &&
        setErrors(
          result.error.issues.map((err: { message: string }) => ({
            code: "validation_error",
            message: err.message,
          }))
        );
      return;
    }
    handleSubmit(e);
  };

  // Validate email before forgot password
  const handleForgotPassword = () => {
    setErrors && setErrors(undefined);
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setErrors &&
        setErrors(
          result.error.issues.map((err: { message: string }) => ({
            code: "validation_error",
            message: err.message,
          }))
        );
      return;
    }
    forgotPasswordCode(email);
  };

  // Combine local validation errors and remote errors
  const allErrors = [...(errors || [])];

  return (
    <form onSubmit={handleValidatedSubmit}>
      <>
        <ErrorSuccessMessages errors={allErrors} />
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-primary bg-transparent border-none p-0 cursor-pointer"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </button>
            </div>
            <PasswordInput onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <OAuthButtons signInWith={signInWith} />
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </>
    </form>
  );
}
