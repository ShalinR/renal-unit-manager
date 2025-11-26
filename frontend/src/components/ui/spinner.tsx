import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <Loader className={cn("animate-spin text-primary", className)} />
  );
};

export const FullPageSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
};
