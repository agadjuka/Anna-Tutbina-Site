import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";

interface PortableTextContentProps {
  value: any;
  className?: string;
  smallFont?: boolean;
}

export function PortableTextContent({ value, className, smallFont, style }: PortableTextContentProps & { style?: React.CSSProperties }) {
  if (!value) return null;

  // Если явно передан стиль шрифта — пробрасываем его внутрь PortableText
  if (style && style.fontSize) {
    return (
      <div>
        <PortableText
          value={value}
          components={{
            block: {
              normal: ({ children }) => <p style={style}>{children}</p>
            }
          }}
        />
      </div>
    );
  }

  if (style) {
    return (
      <div style={style}>
        <PortableText value={value} />
      </div>
    );
  }

  if (smallFont) {
    return (
      <div className={cn("text-sm md:text-base text-muted-foreground", className)}>
        <PortableText value={value} />
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <PortableText value={value} />
    </div>
  );
}


