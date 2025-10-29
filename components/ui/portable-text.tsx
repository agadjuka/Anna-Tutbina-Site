import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";

interface PortableTextContentProps {
  value: any;
  className?: string;
}

export function PortableTextContent({ value, className }: PortableTextContentProps) {
  if (!value) return null;

  return (
    <div className={cn("prose max-w-none prose-headings:font-serif prose-p:text-gray-800", className)}>
      <PortableText value={value} />
    </div>
  );
}


