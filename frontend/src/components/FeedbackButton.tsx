import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle, Send, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { feedbackApi } from "@/services/feedbackApi";
import { useToast } from "@/hooks/use-toast";

export const FeedbackButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Only show for doctors and nurses
  if (!user || (user.role !== "DOCTOR" && user.role !== "NURSE")) {
    return null;
  }

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback message",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await feedbackApi.create({
        submittedBy: user.username,
        submittedByName: user.fullName || user.username,
        role: user.role,
        message: message.trim(),
      });

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback. We'll review it soon.",
      });

      setMessage("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <HelpCircle className="h-6 w-6" />
          <span className="sr-only">Report Issue</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Issue or Provide Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by reporting any issues or providing feedback. Your message will be sent to administrators.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-message">Your Feedback</Label>
            <Textarea
              id="feedback-message"
              placeholder="Describe the issue or provide your feedback..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setMessage("");
              }}
              disabled={submitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


