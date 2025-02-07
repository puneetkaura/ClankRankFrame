import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className,
  message 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      className
    )}>
      <Loader2 
        className={cn(
          "animate-spin text-primary/80",
          sizeClasses[size]
        )} 
      />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
