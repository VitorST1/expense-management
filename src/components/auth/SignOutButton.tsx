import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";

export default function SignOutButton() {
    const navigate = useNavigate()

    const signOut = () => {
        authClient.signOut()
        navigate({ to: "/sign-in" })
    }

    return (
        <Button onClick={signOut}>
            Sign out
        </Button>
    )
}