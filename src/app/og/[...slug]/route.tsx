import { readFile } from "node:fs/promises";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  const logoPath = new URL(
    "../../../public/favicon-greyscale.png",
    import.meta.url,
  );
  const logoBuffer = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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

  const textWhites = [
    "rgba(255, 255, 255, 0.7)",
    "rgba(255, 255, 255, 0.85)",
    "rgba(255, 255, 255, 1)",
  ];

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "80px 120px",
        backgroundColor: "#4D4D4D",
        fontFamily:
          "'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <img
        src={logoSrc}
        width={630}
        height={630}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          opacity: 1,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 28px",
          borderRadius: 9999,
          backgroundColor: "#FFFFFF",
          color: "#2B2530",
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 32,
          alignSelf: "flex-start",
          border: "1px solid rgba(43, 37, 48, 0.08)",
          boxShadow: "0 10px 24px rgba(36, 32, 40, 0.18)",
        }}
      >
        <span style={{ letterSpacing: "-0.02em" }}>{brandLabel}</span>
      </div>
      {lines.map((text, index) => {
        // index 0: parent (if present), index 1: leaf
        const depthIndex = index + 1; // deeper than brand
        const fontSize = 40 + depthIndex * 14;
        const fontWeight = 500 + depthIndex * 150;
        const lineColor =
          textWhites[Math.min(depthIndex, textWhites.length - 1)];

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
