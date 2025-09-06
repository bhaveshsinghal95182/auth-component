import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";
import { formatError } from "@/hooks/use-error-message";
import { ClerkAPIError } from "@clerk/types";

export function useResetPassword() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const [error, setError] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);

  // Send the password reset code to the user's email
  async function sendCode(email: string) {
    setError("");
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err: ClerkAPIError | unknown) {
      setError(formatError(err));
    }
  }

  // Reset the user's password
  async function resetPassword(code: string, password: string) {
    setError("");
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (result?.status === "needs_second_factor") {
        setSecondFactor(true);
      } else if (result?.status === "complete") {
        await setActive?.({
          session: result.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.push("/");
          },
        });
      } else {
        setError("Unexpected status: " + result?.status);
      }
    } catch (err: unknown) {
      setError(formatError(err));
    }
  }

  return {
    error,
    successfulCreation,
    secondFactor,
    sendCode,
    resetPassword,
    setError,
  };
}
