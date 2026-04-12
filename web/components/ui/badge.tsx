import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-colors";

    const variants = {
      default: "bg-primary/10 text-primary",
      secondary: "bg-neutral text-secondary",
      success: "bg-tertiary/10 text-tertiary",
      warning: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
      error: "bg-error/10 text-error",
    };

    const sizes = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-3 py-1",
      lg: "text-base px-4 py-1.5",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
