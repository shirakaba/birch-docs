import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions } from "@/lib/layout.shared";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";

export const metadata = createMetadata({
  title: {
    template: "%s | Birchdocs",
    default: "Birchdocs",
  },
  description: "Jamie Birch's personal docs site",
  metadataBase: baseUrl,
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
