import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In · NitHub Talent Spotlight",
  description:
    "Sign in to the NitHub Placement Admin portal to verify intern profiles and manage employer requests.",
};

export default function AdminLoginPage() {
  return (
    <AuthSplitLayout mode="admin">
      <AdminLoginForm />
    </AuthSplitLayout>
  );
}
