import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// Enhanced button variants for medical interface
const medicalButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground text-white shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input text-black bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Medical variants
        medical: "medical-gradient text-white shadow-lg medical-shadow hover:scale-105 medical-transition",
        success: "bg-medical-success text-white shadow hover:bg-medical-success/90",
        warning: "bg-medical-warning text-white shadow hover:bg-medical-warning/90",
        info: "bg-medical-info text-white shadow hover:bg-medical-info/90",
        unit: "bg-card text-card-foreground border card-shadow hover:shadow-lg medical-transition hover:border-primary/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        xl: "h-12 rounded-xl px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface MedicalButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "medical" | "success" | "warning" | "info" | "unit";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
}

const MedicalButton = forwardRef<HTMLButtonElement, MedicalButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(medicalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

MedicalButton.displayName = "MedicalButton";

export { MedicalButton, medicalButtonVariants };