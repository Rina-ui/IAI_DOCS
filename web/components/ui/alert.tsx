import * as React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-50",
  success: "bg-tertiary/10 border-tertiary/20 text-tertiary",
  warning: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-50",
  error: "bg-error/10 border-error/20 text-error",
};

const variantIcons: Record<AlertVariant, React.ReactNode> = {
  info: <Info size={18} />,
  success: <CheckCircle size={18} />,
  warning: <AlertCircle size={18} />,
  error: <AlertCircle size={18} />,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, children, dismissible, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={`rounded-xl border p-4 ${variantStyles[variant]} ${className || ""}`}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">{variantIcons[variant]}</div>
          <div className="flex-1">
            {title && <h5 className="font-bold mb-1">{title}</h5>}
            <div className="text-sm opacity-90">{children}</div>
          </div>
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };
