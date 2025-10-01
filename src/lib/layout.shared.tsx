import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

import Logo from "@/public/logo.png";

// https://github.com/fuma-nama/fumadocs/blob/6c3bde5b4d95c9fd854815be9d94968ac6a39c18/apps/docs/lib/layout.shared.tsx#L39C1-L51C3
// https://www.flaticon.com/free-icon/birch-tree_1846071?related_id=1846074&origin=search
export const logo = (
  <Image
    width="20"
    height="20"
    src={Logo}
    alt="Logo"
    className="rounded-full bg-cyan-100 dark:bg-blue-950"
  />
);

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium [header_&]:text-[15px]">Birchdocs</span>
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
