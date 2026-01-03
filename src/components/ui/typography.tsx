import React from "react";
import { cn } from "@/lib/utils";

type TypographyVariant =
  | "heading1"
  | "heading2"
  | "heading3"
  | "body"
  | "bodySm"
  | "listItem"
  | "helpText";

type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  variant?: TypographyVariant;
};

const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  heading1:
    "text-foreground text-2xl font-medium tracking-tight animate-fade-in-up capitalize",
  heading2: "text-foreground text-base font-medium tracking-tight capitalize",
  heading3: "text-foreground text-sm font-medium tracking-tight capitalize",
  body: "text-foreground whitespace-pre-wrap animate-fade-in-up animate-stagger-1",
  bodySm: "text-sm text-foreground",
  listItem: "text-base text-foreground",
  helpText: "text-xs text-foreground font-medium",
};

export function Typography({
  className,
  as: Tag = "p",
  variant = "body",
  ...props
}: TypographyProps) {
  const classes = VARIANT_CLASSES[variant] || VARIANT_CLASSES["body"];
  return (
    <Tag className={cn(classes + " leading-relaxed", className)} {...props} />
  );
}
