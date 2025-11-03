import { PortableText } from "@portabletext/react";
import type { PortableTextReactComponents } from "@portabletext/react";
import { cn } from "@/lib/utils";

interface PortableTextContentProps {
  value: any;
  className?: string;
  smallFont?: boolean;
}

export function PortableTextContent({ value, className, smallFont, style }: PortableTextContentProps & { style?: React.CSSProperties }) {
  if (!value) return null;

  // Компоненты для обработки жирного текста
  const textComponents: Partial<PortableTextReactComponents> = {
    marks: {
      strong: (props) => (
        <strong style={{ fontFamily: 'var(--font-tt-drugs), system-ui, arial, sans-serif', fontWeight: 700, fontSize: 'inherit', lineHeight: 'inherit' }}>
          {props.children}
        </strong>
      ),
    },
    block: {
      normal: (props) => {
        if (style && style.fontSize) {
          return <p style={style}>{props.children}</p>;
        }
        return <p>{props.children}</p>;
      },
    },
  };

  // Если явно передан стиль шрифта — пробрасываем его внутрь PortableText
  if (style && style.fontSize) {
    return (
      <div>
        <PortableText
          value={value}
          components={textComponents}
        />
      </div>
    );
  }

  if (style) {
    return (
      <div style={style}>
        <PortableText value={value} components={textComponents} />
      </div>
    );
  }

  if (smallFont) {
    return (
      <div className={cn("text-sm md:text-base text-muted-foreground", className)}>
        <PortableText value={value} components={textComponents} />
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <PortableText value={value} components={textComponents} />
    </div>
  );
}


