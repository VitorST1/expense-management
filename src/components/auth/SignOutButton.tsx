import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import { m } from "@/paraglide/messages"

export default function SignOutButton() {
    const navigate = useNavigate()

    const signOut = () => {
        authClient.signOut()
        navigate({ to: "/sign-in", search: { redirect: "/" } })
    }

    return (
        <Button onClick={signOut}>
            {m.sign_out()}
        </Button>
    )
}