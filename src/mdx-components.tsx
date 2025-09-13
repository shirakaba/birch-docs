import type { CardProps } from "fumadocs-ui/components/card";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { icons } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { createElement, type ReactNode } from "react";

const Card = defaultMdxComponents.Card;

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Card: function BirchCard({
      children,
      icon,
      knownIcon,
      ...rest
    }: CardProps & { knownIcon?: keyof typeof icons }) {
      const resolvedIcon: ReactNode =
        knownIcon && knownIcon in icons
          ? createElement(icons[knownIcon])
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
