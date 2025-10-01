// Based on https://github.com/fuma-nama/fumadocs/blob/e0cfcdcdd54603bfacd7e016d29b658bdc6c74e4/apps/docs/lib/metadata.ts
import type { Metadata } from "next/types";

import DarkIcon from "@/public/favicon-dark.png";
import LightIcon from "@/public/favicon-light.png";

/**
 *
 * @see https://fumadocs.dev
 * @see https://github.com/fuma-nama/fumadocs/blob/e0cfcdcdd54603bfacd7e016d29b658bdc6c74e4/apps/docs/public/banner.png
 */
export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    icons: {
      // These aren't working, so consider embedding a PNG inside an SVG
      // https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
      icon: [
        {
          rel: "icon",
          type: "image/x-icon",
          url: LightIcon.src,
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          type: "image/png",
          url: DarkIcon.src,
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
  };
}
