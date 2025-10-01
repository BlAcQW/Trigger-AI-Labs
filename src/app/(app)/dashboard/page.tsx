
import LiveView from "@/components/dashboard/live-view";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Live View</h1>
        <p className="text-muted-foreground">Monitor camera feeds and real-time detections.</p>
      </header>
      <LiveView />
    </div>
  );
}
