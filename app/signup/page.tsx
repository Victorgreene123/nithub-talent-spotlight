import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Intern Profile · NitHub Talent Spotlight",
  description:
    "Create your NitHub Talent Spotlight profile to showcase your shipped projects and connect with employers.",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout mode="signup">
      <SignupForm />
    </AuthSplitLayout>
  );
}
