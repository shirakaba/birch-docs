import { getPageTreePeers } from "fumadocs-core/server";
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
            DocsCategory: ({ url }) => {
              return <DocsCategory url={url ?? page.url} />;
            },
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

// https://github.com/fuma-nama/fumadocs/blob/65237fa2f095fe4b6840bb31490fe802bed89158/apps/docs/app/docs/%5B...slug%5D/page.tsx#L135
function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {getPageTreePeers(source.pageTree, url).map((peer) => (
        <Card key={peer.url} icon={peer.icon} title={peer.name} href={peer.url}>
          {peer.description}
        </Card>
      ))}
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
