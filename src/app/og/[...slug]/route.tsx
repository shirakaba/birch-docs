import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await context.params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const brandLabel = "Birchlabs";

  let parentTitle: string | undefined;
  if (page.slugs.length > 1) {
    const parent = source.getPage(page.slugs.slice(0, -1));
    parentTitle = parent?.data.title;
  }

  const hasMoreParents = page.slugs.length > 2;

  const lines: string[] = [];
  if (parentTitle) {
    lines.push(hasMoreParents ? `… / ${parentTitle}` : parentTitle);
  }
  lines.push(page.data.title);

  const textGreys = ["#6b6b6b", "#4f4f4f", "#1e1e1e"];

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "80px 120px",
        backgroundColor: "#DBD8DC",
        fontFamily:
          "'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 24px",
          borderRadius: 9999,
          backgroundColor: "#453D47",
          color: "#DBD8DC",
          fontSize: 32,
          fontWeight: 600,
          marginBottom: 24,
          alignSelf: "flex-start",
        }}
      >
        {brandLabel}
      </div>
      {lines.map((text, index) => {
        // index 0: parent (if present), index 1: leaf
        const depthIndex = index + 1; // deeper than brand
        const fontSize = 40 + depthIndex * 14;
        const fontWeight = 500 + depthIndex * 150;
        const lineColor =
          textGreys[Math.min(depthIndex, textGreys.length - 1)];

        return (
          <div
            key={`${index}-${text}`}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: `${depthIndex * 48}px`,
              marginBottom: index === lines.length - 1 ? 0 : 16,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize,
              fontWeight,
              color: lineColor,
            }}
          >
            <span>{text}</span>
          </div>
        );
      })}
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
