import {
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

export const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "Milestones", href: "/dashboard/milestones", icon: ListChecks },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { label: "Check-in", href: "/dashboard/check-in", icon: CheckCircle2 },
  { label: "Insights", href: "/dashboard/insights", icon: Sparkles },
];

export const systemNav: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
