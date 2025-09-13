import type { CardProps } from "fumadocs-ui/components/card";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { icons } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { createElement, type ReactNode } from "react";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,

    // Similarly to `src/lib/source.ts`, if we get a string-based icon prop,
    // look it up from the lucide-react icons for convenience.
    Card: function BirchCard({ children, icon, ...rest }: CardProps) {
      const resolvedIcon: ReactNode =
        typeof icon === "string" && icon in icons
          ? createElement(icons[icon as keyof typeof icons])
          : icon;

      return (
        <Card {...rest} icon={resolvedIcon}>
          {children}
        </Card>
      );
    },

    ...components,
  };
}

const { Card } = defaultMdxComponents;
