'use client';

import { useEffect, useState } from 'react';
import { summarizeDetectionHistory } from '@/ai/flows/summarize-detection-history';
import { detectionHistory } from '@/lib/data';
import { type DetectionEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bot, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { Card, CardContent } from '../ui/card';

export default function HistoryTable() {
  const [history] = useState<DetectionEvent[]>(detectionHistory);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const result = await summarizeDetectionHistory({
        detectionHistory: JSON.stringify(history),
      });
      setSummary(result.summary);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('There was an error generating the summary. Please try again.');
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: DetectionEvent['callStatus']) => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'initiated':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          Summarize History with AI
        </Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Camera ID</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Call Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((event) => (
                <TableRow key={event.eventId}>
                  <TableCell className="font-medium">{event.eventId}</TableCell>
                  <TableCell>{isClient ? event.timestamp.toLocaleString() : ''}</TableCell>
                  <TableCell>{event.cameraId}</TableCell>
                  <TableCell>{event.confidence.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(event.callStatus)} className="capitalize">
                      {event.callStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Detection History Summary</AlertDialogTitle>
            <AlertDialogDescription>
              {summary}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
