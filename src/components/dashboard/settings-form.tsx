"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { generateGreetingFromPrompt } from "@/ai/flows/generate-greeting-from-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Mail, Phone, PlusCircle, Trash2, Webhook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GreetingFormInputs = {
  prompt: string;
};

export default function SettingsForm() {
  const { register, handleSubmit, reset } = useForm<GreetingFormInputs>();
  const [generatedGreeting, setGeneratedGreeting] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(["+1 (555) 123-4567"]);
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>("");

  const { toast } = useToast();

  const onGenerateGreeting: SubmitHandler<GreetingFormInputs> = async (data) => {
    setIsGenerating(true);
    setGeneratedGreeting("");
    try {
      const result = await generateGreetingFromPrompt({ prompt: data.prompt });
      setGeneratedGreeting(result.greeting);
      reset();
    } catch (error) {
      console.error("Failed to generate greeting:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate a greeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const addPhoneNumber = () => {
    if (newPhoneNumber.trim()) {
        setPhoneNumbers(prev => [...prev, newPhoneNumber.trim()]);
        setNewPhoneNumber('');
    }
  }

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="voice">Voice Messages</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage core settings for your system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                <Label>Call Target Phone Numbers</Label>
                <div className="space-y-2">
                    {phoneNumbers.map((num, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="flex-1 text-sm">{num}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removePhoneNumber(index)}>
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input value={newPhoneNumber} onChange={e => setNewPhoneNumber(e.target.value)} placeholder="Enter new phone number" />
                    <Button onClick={addPhoneNumber}><PlusCircle className="mr-2 h-4 w-4"/> Add Number</Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="voice">
        <Card>
          <CardHeader>
            <CardTitle>Voice Message Customization</CardTitle>
            <CardDescription>
              Generate or set custom voice messages to be played during calls.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
                <Label>Generate Greeting with AI</Label>
                <form onSubmit={handleSubmit(onGenerateGreeting)} className="space-y-3">
                    <Textarea
                        {...register("prompt", { required: true })}
                        placeholder="e.g., 'A flash sale on summer dresses' or 'New arrivals of vintage denim'"
                    />
                    <Button type="submit" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
                        Generate Greeting
                    </Button>
                </form>
                {generatedGreeting && (
                    <Card className="bg-primary/10 border-primary/20">
                        <CardContent className="p-4">
                            <p className="text-primary-foreground font-medium">{generatedGreeting}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-4">
              <Label>Voice Type</Label>
              <RadioGroup defaultValue="tts" className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tts" id="tts" />
                  <Label htmlFor="tts">Text-to-Speech (TTS)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prerecorded" id="prerecorded" />
                  <Label htmlFor="prerecorded">Pre-recorded Audio</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Choose how you want to be notified of detection events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Webhook className="w-4 h-4"/>Web Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications directly in your browser.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Mail className="w-4 h-4"/>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get an email for every detection event.</p>
                </div>
                <Switch />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
