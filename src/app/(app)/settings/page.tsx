import SettingsForm from "@/components/dashboard/settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings, voice messages, and notifications.
        </p>
      </header>
      <SettingsForm />
    </div>
  );
}
