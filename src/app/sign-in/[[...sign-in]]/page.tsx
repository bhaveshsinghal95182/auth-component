"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState } from "react";
import { useSignInHandlers } from "@/hooks/sign-in/use-sign-in";
import { SignInForm } from "@/components/sign-in/signin-form";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isSubmitting, errors, handleSubmit, signInWith, forgotPasswordCode, setErrors } =
    useSignInHandlers();
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isSubmitting={isSubmitting}
                errors={errors}
                setErrors={setErrors}
                handleSubmit={(e) => handleSubmit(e, email, password)}
                signInWith={signInWith}
                forgotPasswordCode={forgotPasswordCode}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
