import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Intern Sign In · NitHub Talent Spotlight",
  description:
    "Sign in to your NitHub intern workspace to review employer introductions and update your projects.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout mode="login">
      <LoginForm />
    </AuthSplitLayout>
  );
}
