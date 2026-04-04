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
  // Our OG metadata points crawlers at /og/dev/android/gradle/image.png, and
  // source.getPage(['dev', 'android', 'gradle', 'image.png']) returns
  // undefined, so we want to omit 'image.png'.
  const pageSlug = slug.at(-1) === "image.png" ? slug.slice(0, -1) : slug;

  const height = 630;
  const minTextOpacity = 0.33;

  // TODO: handle the case of having too many lines to display (more than 4~5?)
  const lines = new Array<string>();

  console.log({ slug, pageSlug });

  for (let i = 0; i < pageSlug.length; i++) {
    // Omit "Software Engineering" and "Other" categories from page hierarchy
    if (i === 0 && (pageSlug[i] === "dev" || pageSlug[i] === "other")) {
      continue;
    }
    const subslug = pageSlug.slice(0, i + 1);
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
        justifyContent: "space-between",
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

      {/* Align the hierarchy to the vertical center of the remaining space */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          // row-gap seems bugged along with `justifyContent: "space-between"`
          marginTop: "24px",
          marginBottom: "24px",
        }}
      >
        {lines.length ? (
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
                        <div
                          style={{ fontSize: 16 }}
                        >{`${line.slice(0, 1)}`}</div>
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
        ) : (
          <div style={{ paddingLeft: "24px", fontSize: 52, color: "white" }}>
            {"Jamie's personal docs site"}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "0px",
          left: "0px",
          right: "0px",
          height: "60px",
          paddingTop: "64px",
          paddingLeft: "64px",
          fontSize: "74px",
          color: "white",
        }}
      >
        Birchdocs
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
