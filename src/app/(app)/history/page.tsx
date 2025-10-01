import HistoryTable from '@/components/dashboard/history-table';

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Detection History</h1>
        <p className="text-muted-foreground">
          Review past detection events and analyze trends.
        </p>
      </header>
      <HistoryTable />
    </div>
  );
}
