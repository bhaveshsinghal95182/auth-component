import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatError } from "@/hooks/use-error-message";

export function useSignUpHandlers() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Handle submission of the sign-up form
  async function signUpWithEmail(emailAddress: string, password: string) {
    setError("");
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      setError(formatError(err));
    }
  }

  // Handle the submission of the verification form
  async function verifyCode(code: string) {
    setError("");
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            await router.push("/");
          },
        });
      } else {
        setError("Verification not complete. Further steps may be required.");
      }
    } catch (err: any) {
      setError(formatError(err));
    }
  }

  return {
    error,
    verifying,
    signUpWithEmail,
    verifyCode,
    setError,
  };
}
