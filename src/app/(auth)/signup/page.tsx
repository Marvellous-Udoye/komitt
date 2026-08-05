import { AuthPanel } from "@/features/auth/components/auth-panel";

export const metadata = {
  title: "Sign up",
  description:
    "Create your Komitt account in seconds with Google. Turn your goals into a plan, check in daily, and let AI coach the next move.",
  openGraph: {
    title: "Sign up | Komitt",
    description:
      "Start your next momentum. Create an account and turn goals into daily proof of progress.",
  },
};

export default function SignupPage() {
  return <AuthPanel mode="signup" />;
}
