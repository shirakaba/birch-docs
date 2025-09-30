// Based on https://github.com/fuma-nama/fumadocs/blob/e0cfcdcdd54603bfacd7e016d29b658bdc6c74e4/apps/docs/lib/metadata.ts
import type { Metadata } from "next/types";

/**
 *
 * @see https://fumadocs.dev
 * @see https://github.com/fuma-nama/fumadocs/blob/e0cfcdcdd54603bfacd7e016d29b658bdc6c74e4/apps/docs/public/banner.png
 */
export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
  };
}

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
