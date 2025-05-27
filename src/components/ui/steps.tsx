
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number;
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ className, currentStep, children, ...props }, ref) => {
    const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[];
    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;
          
          return (
            <React.Fragment key={index}>
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                    isCompleted 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : isCurrent
                        ? "border-primary bg-background text-primary"
                        : "border-gray-300 bg-background text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2Icon className="h-6 w-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      (isCompleted || isCurrent) ? "text-primary" : "text-gray-500"
                    )}
                  >
                    {step.props.title}
                  </div>
                  {step.props.description && (
                    <div
                      className={cn(
                        "text-xs",
                        (isCompleted || isCurrent) ? "text-gray-700" : "text-gray-400"
                      )}
                    >
                      {step.props.description}
                    </div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 border-t-2",
                    isCompleted ? "border-primary" : "border-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Steps.displayName = "Steps";

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(className)} {...props} />;
  }
);

Step.displayName = "Step";

export { Steps, Step };
