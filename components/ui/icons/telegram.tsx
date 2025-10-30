import * as React from "react";

export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M22 2.5c.33-.14.7-.2 1.06-.06.51.2.77.76.6 1.28l-3.67 11.56c-.17.54-.76.86-1.3.68-.35-.12-.63-.41-.72-.77l-1.1-4.2-6.4 5.82c-.37.34-.93.39-1.36.12l-2.84-1.76c-.33-.2-.52-.57-.49-.95.03-.39.26-.73.61-.91L21.6 2.66 22 2.5zm-5.58 5.4-8.9 4.64c-.05.03-.05.1 0 .13l1.9 1.18c.05.03.11.03.16-.02l6.24-5.68c.1-.09.26-.03.29.1l1.05 4.03c.02.08.13.08.15 0l2.9-9.14c.03-.1-.07-.19-.16-.14l-3.63 1.9Z" />
    </svg>
  );
}


