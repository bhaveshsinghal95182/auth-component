import { Button } from "@/components/ui/button";
import { OAuthStrategy } from "@clerk/types";

interface OAuthButtonsProps {
  signInWith: (provider: OAuthStrategy) => void;
}

export function OAuthButtons({ signInWith }: OAuthButtonsProps) {
  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signInWith("oauth_google")}
      >
        Login with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signInWith("oauth_github")}
      >
        Login with GitHub
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signInWith("oauth_apple")}
      >
        Login with Apple
      </Button>
    </>
  );
}
