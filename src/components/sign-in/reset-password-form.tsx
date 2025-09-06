import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorSuccessMessages } from "@/components/error-success-messages";
import { useResetPassword } from "@/hooks/sign-in/use-reset-password";
import { z } from "zod";

export function ResetPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { error, successfulCreation, sendCode, resetPassword, setError } =
    useResetPassword();

  // Zod schemas
  const emailSchema = z
    .string()
    .email({ message: "Please enter a valid email address." });
  const codeSchema = z
    .string()
    .min(4, { message: "Code must be at least 4 characters." });
  const passwordSchema = z
    .object({
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  // Step 1: Send code
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      const message = result.error.issues.map((err) => err.message).join(" ");
      setError(message);
      return;
    }
    sendCode(email);
  };

  // Step 2: Reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const codeResult = codeSchema.safeParse(code);
    const passResult = passwordSchema.safeParse({ password, confirmPassword });
    const messages: string[] = [];
    if (!codeResult.success) {
      messages.push(...codeResult.error.issues.map((i) => i.message));
    }
    if (!passResult.success) {
      messages.push(...passResult.error.issues.map((i) => i.message));
    }
    if (messages.length > 0) {
      setError(messages.join(" "));
      return;
    }
    resetPassword(code, password);
  };

  // Combine errors
  const allErrors = [...(error ? [{ code: "api_error", message: error }] : [])];

  return (
    <div className="w-full max-w-sm mx-auto mt-10">
      <ErrorSuccessMessages errors={allErrors} />
      {!successfulCreation ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Send Reset Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <Label htmlFor="code">Code from Email</Label>
          <Input
            id="code"
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
}
