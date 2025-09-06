import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy, ClerkAPIError } from "@clerk/types";
import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";
import { formatError } from "@/hooks/use-error-message";

export function useSignInHandlers() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const router = useRouter();
  const getErrorMessage = formatError;

  const handleSubmit = async (
    e: React.FormEvent,
    email: string,
    password: string
  ) => {
    e.preventDefault();
    if (!isLoaded) return;
    setErrors(undefined);
    setIsSubmitting(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.push("/");
          },
        });
      } else {
        setErrors([
          {
            code: "sign_in_not_complete",
            message: `Sign-in not complete: ${String(signInAttempt.status)}`,
          },
        ]);
        console.error(signInAttempt);
      }
    } catch (err: unknown) {
      setErrors([
        {
          code: "unknown_error",
          message: getErrorMessage(err),
        },
      ]);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWith = async (strategy: OAuthStrategy) => {
    if (!signIn) return;
    setErrors(undefined);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: unknown) {
      setErrors([
        {
          code: "oauth_error",
          message: getErrorMessage(err),
        },
      ]);
      console.error(err);
    }
  };

  const forgotPasswordCode = async (email: string) => {
    if (!isLoaded) return;
    setErrors(undefined);
    setIsSubmitting(true);
    try {
        await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then((_) => {
        setErrors([{ code: "success", message: "Password reset email sent" }]);
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setErrors([{ code: "unknown_error", message: getErrorMessage(err) }]);
      });
    } catch (err: unknown) {
      setErrors([
        {
          code: "unknown_error",
          message: getErrorMessage(err),
        },
      ]);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errors,
    handleSubmit,
    signInWith,
    setErrors,
    forgotPasswordCode
  };
}
