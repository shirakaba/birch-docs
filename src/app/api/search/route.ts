import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/lib/source";

// https://fumadocs.dev/docs/headless/search/orama#static-export
export const revalidate = false;
export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
