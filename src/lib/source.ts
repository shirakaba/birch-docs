import { SiAndroid, SiApple, SiGradle, SiJavascript, SiMetro, SiReact, SiRuby } from "@icons-pack/react-simple-icons";
import { type InferPageType, loader } from "fumadocs-core/source";
import { icons as lucideIcons } from "lucide-react";
import { createElement } from "react";

import { docs } from "@/.source";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: "/",
  source: docs.toFumadocsSource(),

  // This is for setting icons in the sidebar, based off the `icon` frontmatter
  // in pages and meta files.
  // https://fumadocs.dev/docs/headless/source-api#icons
  icon(name) {
    if(!name){
      return null;
    }

    if(name in lucideIcons){
      return createElement(lucideIcons[name as keyof typeof lucideIcons]);
    }
    if(name in iconsPack){
      return createElement(iconsPack[name as keyof typeof iconsPack]);
    }

    return null;
  },
});

/** OG image URL and path segments for a page (used by next/og route and metadata). */
export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}

// Expand this case-by-case to avoid bundling the whole library
const iconsPack = {
  SiApple,
  SiAndroid,
  SiGradle,
  SiJavascript,
  SiMetro,
  SiReact,
  SiRuby,
};