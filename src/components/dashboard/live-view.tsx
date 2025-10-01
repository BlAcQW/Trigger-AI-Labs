"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { PersonStanding, Video, VideoOff } from "lucide-react";
import { type DetectionEvent } from "@/lib/types";
import { Badge } from "../ui/badge";

type Detection = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
};

export default function LiveView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [roi, setRoi] = useState({ x: 10, y: 10, width: 80, height: 80 }); // in percentage
  const [sensitivity, setSensitivity] = useState(0.7);
  const [recentEvents, setRecentEvents] = useState<DetectionEvent[]>([]);
  const { toast } = useToast();

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Could not access the camera. Please check permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
      setDetections([]);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;

    if (isCameraOn) {
      detectionInterval = setInterval(() => {
        if (Math.random() > (1 - sensitivity * 0.5)) {
          const video = videoRef.current;
          if (!video) return;

          const newDetection: Detection = {
            x: roi.x + Math.random() * roi.width,
            y: roi.y + Math.random() * roi.height,
            width: 15 + Math.random() * 10, // random width %
            height: 30 + Math.random() * 20, // random height %
            id: Date.now(),
          };

          setDetections((prev) => [...prev, newDetection].slice(-5));
          
          const newEvent: DetectionEvent = {
            eventId: `evt_${Date.now()}`,
            timestamp: new Date(),
            confidence: Math.random() * (0.99 - 0.8) + 0.8,
            cameraId: 'CAM-LIVE',
            callStatus: 'initiated',
          };
          
          setRecentEvents(prev => [newEvent, ...prev].slice(0, 5));
          
          toast({
            title: "Person Detected!",
            description: "A voice call has been triggered.",
            action: <div className="p-2 bg-accent rounded-md"><PersonStanding className="text-accent-foreground" /></div>,
          });
        }
      }, 2000);
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isCameraOn, sensitivity, roi, toast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const draw = () => {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ROI
      ctx.strokeStyle = "hsla(var(--primary))";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      const roiRect = {
        x: (roi.x / 100) * canvas.width,
        y: (roi.y / 100) * canvas.height,
        width: (roi.width / 100) * canvas.width,
        height: (roi.height / 100) * canvas.height,
      };
      ctx.strokeRect(roiRect.x, roiRect.y, roiRect.width, roiRect.height);
      ctx.setLineDash([]);

      // Draw detections
      ctx.strokeStyle = "hsla(var(--accent))";
      ctx.lineWidth = 3;
      ctx.fillStyle = "hsla(var(--accent), 0.2)";

      detections.forEach(det => {
        const detRect = {
            x: (det.x / 100) * canvas.width,
            y: (det.y / 100) * canvas.height,
            width: (det.width / 100) * canvas.width,
            height: (det.height / 100) * canvas.height,
        }
        ctx.strokeRect(detRect.x, detRect.y, detRect.width, detRect.height);
        ctx.fillRect(detRect.x, detRect.y, detRect.width, detRect.height);
      });

      requestAnimationFrame(draw);
    }

    draw();

  }, [detections, roi, isCameraOn]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Live Camera Feed</CardTitle>
                <CardDescription>Real-time video with person detection overlay.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                {!isCameraOn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <VideoOff className="w-16 h-16 text-muted-foreground" />
                        <p className="text-muted-foreground">Camera is off</p>
                    </div>
                )}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Recent Detections</CardTitle>
                <CardDescription>Last 5 detection events from this session.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {recentEvents.length > 0 ? recentEvents.map(event => (
                        <li key={event.eventId} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                            <div className="flex items-center gap-3">
                                <PersonStanding className="w-5 h-5 text-primary"/>
                                <div>
                                    <p className="font-medium">Person Detected</p>
                                    <p className="text-sm text-muted-foreground">{event.timestamp.toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <Badge variant={event.callStatus === 'initiated' ? 'default' : 'secondary'} className="capitalize">{event.callStatus}</Badge>
                        </li>
                    )) : (
                        <p className="text-muted-foreground text-center py-4">No recent detections.</p>
                    )}
                </ul>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Manage camera and detection settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={isCameraOn ? stopCamera : startCamera} className="w-full">
              {isCameraOn ? <VideoOff className="mr-2" /> : <Video className="mr-2" />}
              {isCameraOn ? "Stop Camera" : "Start Camera"}
            </Button>
            <div className="space-y-3">
              <Label htmlFor="sensitivity">Detection Sensitivity</Label>
              <Slider
                id="sensitivity"
                min={0.1}
                max={1}
                step={0.1}
                value={[sensitivity]}
                onValueChange={(value) => setSensitivity(value[0])}
                disabled={!isCameraOn}
              />
              <p className="text-sm text-center text-muted-foreground">{sensitivity.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Detection Zone (ROI)</CardTitle>
                <CardDescription>Define the Region of Interest in percentages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="roi-x">X</Label>
                        <Input id="roi-x" type="number" value={roi.x} onChange={e => setRoi(r => ({...r, x: parseInt(e.target.value)}))} placeholder="X %"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roi-y">Y</Label>
                        <Input id="roi-y" type="number" value={roi.y} onChange={e => setRoi(r => ({...r, y: parseInt(e.target.value)}))} placeholder="Y %"/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="roi-width">Width</Label>
                        <Input id="roi-width" type="number" value={roi.width} onChange={e => setRoi(r => ({...r, width: parseInt(e.target.value)}))} placeholder="Width %"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roi-height">Height</Label>
                        <Input id="roi-height" type="number" value={roi.height} onChange={e => setRoi(r => ({...r, height: parseInt(e.target.value)}))} placeholder="Height %"/>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
