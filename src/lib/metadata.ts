// Based on https://github.com/fuma-nama/fumadocs/blob/e0cfcdcdd54603bfacd7e016d29b658bdc6c74e4/apps/docs/lib/metadata.ts
import type { Metadata } from "next/types";

import AmbiIcon from "@/public/favicon-ambi.png";

/**
 * Base URL for metadataBase. Next.js resolves relative OG image URLs against this.
 * Uses Vercel env vars only (no extra config): production URL when set, else current deployment URL (preview or prod), else localhost.
 * @see https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/lib/metadata.ts
 */
export const baseUrl =
  process.env.NODE_ENV === "development"
    ? new URL("http://localhost:3000")
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
      : new URL(
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000",
        );

/**
 *
 * @see https://fumadocs.dev
 * @see https://github.com/fuma-nama/fumadocs/blob/e0cfcdcdd54603bfacd7e016d29b658bdc6c74e4/apps/docs/public/banner.png
 */
export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    icons: {
      // Safari doesn't support any approach to dark mode in favicons in
      // practice, so we use a transparent-background favicon that's not too bad
      // in either case.
      icon: [
        {
          rel: "icon",
          type: "image/png",
          url: AmbiIcon.src,
        },
      ],
    },
  };
}
