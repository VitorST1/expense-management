import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

export function SignInWithPassword({
  handlePasswordReset,
  customSignUp,
  passwordRequirements,
}: {
  handlePasswordReset?: () => void;
  customSignUp?: React.ReactNode;
  passwordRequirements?: string;
}) {
  const navigate = useNavigate();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error } = await authClient.signIn.email({email, password, callbackURL: "/", rememberMe: false})
      console.log({data, error})
  
      if (error) {
        console.error(error);
        toast.error("Could not sign in, did you mean to sign up?");
        setSubmitting(false);
  
        return
      }
    } catch (error) {
      console.error('123', error);
      toast.error("Could not sign in, did you mean to sign up?");
      setSubmitting(false);
    }

    navigate({ to: "/" });
  }

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const { data, error } = await authClient.signUp.email({email, password, name, callbackURL: "/"})
      console.log({data, error})
  
      if (error) {
        console.error(error);
        let toastTitle: string;
        if (
          error.code === "PASSWORD_TOO_SHORT"
        ) {
          toastTitle =
            "Invalid password - check the requirements and try again.";
        } else {
          toastTitle = "Could not sign up, did you mean to sign in?"
        }
        toast.error(toastTitle);
        setSubmitting(false);
  
        return
      }
    } catch (error) {
      console.error('123', error);
      toast.error("Could not sign up, did you mean to sign in?");
      setSubmitting(false);
    }

    navigate({ to: "/" });
  }
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);

        if (flow === "signIn") {
          signIn(formData);
          return
        } else {
          signUp(formData);
          return
        }
      }}
    >
      {flow === "signUp" && (
        <>
          <label htmlFor="name">Name</label>
          <Input name="name" id="name" className="mb-4" />
        </>
      )}
      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" />
      <div className="flex items-center justify-between">
        <label htmlFor="password">Password</label>
        {handlePasswordReset && flow === "signIn" ? (
          <Button
            className="p-0 h-auto"
            type="button"
            variant="link"
            onClick={handlePasswordReset}
          >
            Forgot your password?
          </Button>
        ) : null}
      </div>
      <Input
        type="password"
        name="password"
        id="password"
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />
      {flow === "signUp" && passwordRequirements !== null && (
        <span className="text-gray-500 font-thin text-sm">
          {passwordRequirements}
        </span>
      )}
      {flow === "signUp" && customSignUp}
      <input name="flow" value={flow} type="hidden" />
      <Button type="submit" disabled={submitting} className="mt-4">
        {flow === "signIn" ? "Sign in" : "Sign up"}
      </Button>
      <Button
        variant="link"
        type="button"
        onClick={() => {
          setFlow(flow === "signIn" ? "signUp" : "signIn");
        }}
      >
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
}