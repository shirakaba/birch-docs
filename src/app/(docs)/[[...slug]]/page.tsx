import {
  flattenTree,
  getPageTreePeers,
  getPageTreeRoots,
} from "fumadocs-core/server";
import { Card, Cards } from "fumadocs-ui/components/card";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),

            // https://github.com/fuma-nama/fumadocs/blob/65237fa2f095fe4b6840bb31490fe802bed89158/apps/docs/app/docs/%5B...slug%5D/page.tsx#L121
            DocsCategory: ({ url, peerType = "page" }) => {
              return <DocsCategory url={url ?? page.url} peerType={peerType} />;
            },
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

// https://github.com/fuma-nama/fumadocs/blob/65237fa2f095fe4b6840bb31490fe802bed89158/apps/docs/app/docs/%5B...slug%5D/page.tsx#L135
function DocsCategory({
  url,
  peerType,
}: {
  url: string;
  peerType: "folder" | "page" | "any";
}) {
  const peers =
    peerType === "page"
      ? getPageTreePeers(source.pageTree, url)
      : peerType === "folder"
        ? getPageTreeRoots(source.pageTree)
        : source.pageTree.children;

  return (
    <Cards>
      {peers.map((peer) => {
        if (!("type" in peer)) {
          return null;
        }

        switch (peer.type) {
          case "folder": {
            return (
              <Card
                key={peer.$id}
                icon={peer.icon}
                title={peer.name}
                href={flattenTree([peer]).at(0)?.url}
              >
                {peer.description}
              </Card>
            );
          }
          case "page": {
            return (
              <Card
                key={peer.url}
                icon={peer.icon}
                title={peer.name}
                href={peer.url}
              >
                {peer.description}
              </Card>
            );
          }
          case "separator": {
            return null;
          }
        }
      })}
    </Cards>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
