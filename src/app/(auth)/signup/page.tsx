import { AuthPanel } from "@/features/auth/components/auth-panel";

export const metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return <AuthPanel mode="signup" />;
}
