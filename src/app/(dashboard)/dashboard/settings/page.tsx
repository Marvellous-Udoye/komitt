"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, RotateCcw } from "lucide-react";
import { PageHeader, Card, CardHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/lib/dashboard-store";
import { backendSignOut, getSessionUser } from "@/lib/auth-session";
import { UserAvatar } from "@/components/dashboard/user-avatar";

export default function SettingsPage() {
  const router = useRouter();
  const syncFromN8n = useDashboard((state) => state.syncFromN8n);
  const notificationHour = useDashboard((state) => state.notificationHour);
  const setNotificationHour = useDashboard((state) => state.setNotificationHour);
  const [profile, setProfile] = useState(() => {
    const profileUser = getSessionUser();
    return {
      name: profileUser?.name ?? "",
      email: profileUser?.email ?? "",
    };
  });
  const [prefs, setPrefs] = useState({
    weekStart: "monday",
    emailReminders: true,
    dailyNudges: true,
    streakNotifications: false,
  });

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    toast.success("Profile saved", { description: "Your account details were updated." });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account, preferences, and workspace data." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="inline-flex h-9 items-center gap-1 rounded-lg border border-graphite bg-carbon p-1">
          <TabsTrigger
            value="profile"
            className="h-7 rounded-md px-3 text-[12px] text-fog data-[state=active]:bg-white/[0.06] data-[state=active]:text-paper"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="h-7 rounded-md px-3 text-[12px] text-fog data-[state=active]:bg-white/[0.06] data-[state=active]:text-paper"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="h-7 rounded-md px-3 text-[12px] text-fog data-[state=active]:bg-white/[0.06] data-[state=active]:text-paper"
          >
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="max-w-full">
            <CardHeader
              title="Account"
              description="Your identity across the workspace"
              trailing={<UserAvatar user={getSessionUser()} />}
            />
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="settings-name" className="text-[12px] text-fog">
                  Full name
                </Label>
                <Input
                  id="settings-name"
                  value={profile.name}
                  onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                  className="h-10 rounded-md bg-obsidian/40 px-3 text-[14px] text-mist"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="settings-email" className="text-[12px] text-fog">
                  Email
                </Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                  className="h-10 rounded-md bg-obsidian/40 px-3 text-[14px] text-mist"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="h-9 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90"
                >
                  Save changes
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card className="max-w-full">
            <CardHeader title="Preferences" description="How Komitt behaves around your schedule" />
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[13px] text-mist">Week starts on</p>
                  <p className="mt-1 text-[12px] text-fog">Used for weekly consistency charts.</p>
                </div>
                <Select
                  value={prefs.weekStart}
                  onValueChange={(value) => setPrefs({ ...prefs, weekStart: value })}
                >
                  <SelectTrigger className="h-9 w-[140px] rounded-md border-graphite bg-obsidian/40 text-[12px] text-mist">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-graphite bg-obsidian text-mist">
                    <SelectItem value="monday" className="text-[12px]">Monday</SelectItem>
                    <SelectItem value="sunday" className="text-[12px]">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-graphite" />
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[13px] text-mist">Daily summary time</p>
                  <p className="mt-1 text-[12px] text-fog">Choose the hour when Komitt should send your daily accountability summary.</p>
                </div>
                <Select
                  value={String(notificationHour)}
                  onValueChange={(value) => setNotificationHour(Number(value))}
                >
                  <SelectTrigger className="h-9 w-[140px] rounded-md border-graphite bg-obsidian/40 text-[12px] text-mist">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-graphite bg-obsidian text-mist">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <SelectItem key={hour} value={String(hour)} className="text-[12px]">
                        {String(hour).padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-graphite" />
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[13px] text-mist">Email reminders</p>
                  <p className="mt-1 text-[12px] text-fog">Daily accountability email.</p>
                </div>
                <Switch
                  checked={prefs.emailReminders}
                  onCheckedChange={(value) => setPrefs({ ...prefs, emailReminders: value })}
                  className="data-[state=checked]:bg-acid-lime data-[state=checked]:border-acid-lime"
                />
              </div>
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[13px] text-mist">In-app nudges</p>
                  <p className="mt-1 text-[12px] text-fog">Reminders inside the dashboard.</p>
                </div>
                <Switch
                  checked={prefs.dailyNudges}
                  onCheckedChange={(value) => setPrefs({ ...prefs, dailyNudges: value })}
                  className="data-[state=checked]:bg-acid-lime data-[state=checked]:border-acid-lime"
                />
              </div>
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[13px] text-mist">Streak notifications</p>
                  <p className="mt-1 text-[12px] text-fog">Celebrate milestones and streak risks.</p>
                </div>
                <Switch
                  checked={prefs.streakNotifications}
                  onCheckedChange={(value) => setPrefs({ ...prefs, streakNotifications: value })}
                  className="data-[state=checked]:bg-acid-lime data-[state=checked]:border-acid-lime"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => toast.success("Preferences saved")}
                  className="h-9 rounded-md bg-acid-lime text-[13px] font-[510] text-void shadow-none hover:opacity-90"
                >
                  Save preferences
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card className="max-w-full">
            <CardHeader title="Workspace data" description="Reset or export your execution data" />
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-6 rounded-lg border border-graphite/70 bg-obsidian/40 p-4">
                <div>
                  <p className="text-[13px] text-mist">Re-sync dashboard data</p>
                  <p className="mt-1 text-[12px] text-fog">Pull the latest goals, milestones, check-ins, and stats.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    syncFromN8n();
                    toast.success("Data re-synced");
                  }}
                  className="h-9 gap-2 rounded-md border-graphite bg-transparent text-[12px] text-mist hover:bg-white/[0.05]"
                >
                  <RotateCcw className="size-3.5" />
                  Re-sync
                </Button>
              </div>
              <div className="flex items-center justify-between gap-6 rounded-lg border border-graphite/70 bg-obsidian/40 p-4">
                <div>
                  <p className="text-[13px] text-mist">Sign out</p>
                  <p className="mt-1 text-[12px] text-fog">End your session on this device.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    backendSignOut();
                    toast.success("Signed out", {
                      description: "Your session has closed. See you next time.",
                    });
                    router.replace("/");
                  }}
                  className="h-9 gap-2 rounded-md border-graphite bg-transparent text-[12px] text-coral-red hover:bg-coral-red/10 hover:border-coral-red/40"
                >
                  <LogOut className="size-3.5" />
                  Sign out
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
