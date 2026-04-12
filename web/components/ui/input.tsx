import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-secondary/20 bg-neutral px-3 py-2 text-sm text-on-surface ring-offset-background placeholder:text-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""
        }`}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
