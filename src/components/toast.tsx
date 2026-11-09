import { useEffect } from "react";
import { Icon } from "./icon";

export function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timeout);
  }, [message, onDismiss]);

  if (!message) return null;
  return (
    <div className="toast" role="status">
      <Icon name="check" size={18} />
      {message}
    </div>
  );
}
