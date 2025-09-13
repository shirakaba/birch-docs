import { docs } from "@/.source";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),

  // This is for setting icons in the sidebar, based off the `icon` frontmatter
  // in pages and meta files.
  // https://fumadocs.dev/docs/headless/source-api#icons
  icon(icon) {
    if (!icon || !(icon in icons)) {
      return null;
    }

    return createElement(icons[icon as keyof typeof icons]);
  },
});
