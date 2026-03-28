// import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { type CSSProperties } from "react";

import BirchTree from "../../../public/logo-crude-svg-sharp.svg";

import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: Array<string> }> },
) {
  const { slug } = await context.params;
  // const page = source.getPage(slug.slice(0, -1));
  // if (!page) notFound(); // From next/navigation

  const brandLabel = "Birchdocs";

  const height = 630;
  const minTextOpacity = 0.33;

  // TODO: If lines is empty, fall back to slug.join("/")
  const lines = new Array<string>();

  console.log({ slug });
  // console.log(source);

  // Start from i === 1, because i === 0 is always just "Home".
  for (let i = 1; i < slug.length; i++) {
    const subslug = slug.slice(0, i + 1);
    const page = source.getPage(subslug);
    console.log(`${i}:`, subslug, page?.data.title);
    if (!page) {
      // Force a fallback to slug.
      lines.splice(0);
      break;
    }
    lines.push(page.data.title);
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "40px",
        backgroundColor: "#4D4D4D",
        fontFamily:
          "'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <BirchTree
        width={height}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          opacity: 1,
        }}
      />
      <div
        style={{
          padding: "12px 28px",
          marginBottom: "24px",
          borderRadius: 9999,
          backgroundColor: "#EAE9EB",
          color: "#5B535F",
          // color: "#EAE9EB",
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {brandLabel}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingLeft: "24px",
          rowGap: "12px",
        }}
      >
        {lines.map((text, i, acc) => {
          const branchStyle: CSSProperties = {
            marginRight: "0.33em",
          };

          console.log(
            `[${i}] "${text}": ${`rgba(255,255,255,${i + 1 / acc.length})`} (given acc.length ${acc.length})`,
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                whiteSpace: "pre",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: 32,
                // @vercel/og only bundles Noto Sans 400, so this has no effect
                fontWeight: i === acc.length - 1 ? 500 : 300,

                color: `rgba(255,255,255,${minTextOpacity + ((i + 1) / acc.length) * (1 - minTextOpacity)})`,
              }}
            >
              {/* These are purely spacers */}
              {lines.slice(0, i).map((line, j) => {
                return (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      opacity: 0,
                    }}
                  >
                    {j > 0 && (
                      <Branch
                        style={{
                          ...branchStyle,
                          color: `rgba(255,255,255,${minTextOpacity + ((j + 1) / acc.length) * (1 - minTextOpacity) - 0.2})`,
                        }}
                      />
                    )}
                    <div style={{ fontSize: 16 }}>{`${line.slice(0, 1)}`}</div>
                  </div>
                );
              })}

              {i > 0 && (
                <Branch
                  style={{
                    ...branchStyle,
                    color: `rgba(255,255,255,${minTextOpacity + ((i + 1) / acc.length) * (1 - minTextOpacity) - 0.2})`,
                  }}
                />
              )}
              {text}
            </div>
          );
        })}
      </div>
    </div>,
    {
      width: 1200,
      height,
    },
  );
}

function Branch({ style = {} }: { style?: CSSProperties }) {
  const { height = "2em", color = "white" } = style;

  return (
    <div
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottomColor: color,
        borderLeftColor: color,
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        width: "1.5em",
        height,
        marginTop: `-${height}`,
        ...style,
      }}
    ></div>
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
