import {
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
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
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckCircle2 },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { label: "Insights", href: "/dashboard/insights", icon: Sparkles },
];

export const systemNav: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
