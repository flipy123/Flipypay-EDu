import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationProps {
  message?: string;
  type?: "success" | "error" | "info";
  isVisible?: boolean;
  onClose?: () => void;
  duration?: number;
}

export function Notification({ 
  message, 
  type = "success", 
  isVisible = false, 
  onClose,
  duration = 5000 
}: NotificationProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show || !message) return null;

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out",
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        {
          "bg-primary text-primary-foreground": type === "success",
          "bg-destructive text-destructive-foreground": type === "error", 
          "bg-muted text-muted-foreground": type === "info",
        }
      )}
      data-testid="notification"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium flex-1" data-testid="notification-message">
          {message}
        </p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          data-testid="notification-close-btn"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Global notification system
let globalNotificationCallback: ((notification: { message: string; type: "success" | "error" | "info" }) => void) | null = null;

export function showNotification(message: string, type: "success" | "error" | "info" = "success") {
  if (globalNotificationCallback) {
    globalNotificationCallback({ message, type });
  }
}

export function GlobalNotification() {
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    globalNotificationCallback = (notif) => {
      setNotification(notif);
    };

    return () => {
      globalNotificationCallback = null;
    };
  }, []);

  return (
    <Notification
      message={notification?.message}
      type={notification?.type}
      isVisible={!!notification}
      onClose={() => setNotification(null)}
    />
  );
}
