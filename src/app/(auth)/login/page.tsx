import { AuthPanel } from "@/features/auth/components/auth-panel";

export const metadata = {
  title: "Log in",
  description:
    "Log in to Komitt and open your execution board — goals, milestones, check-ins, and AI coaching in one focused workspace.",
  openGraph: {
    title: "Log in | Komitt",
    description: "Return to your momentum. Log in and open your execution board.",
  },
};

export default function LoginPage() {
  return <AuthPanel mode="login" />;
}
