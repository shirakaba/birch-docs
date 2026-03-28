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
      {lines.map((text, index) => {
        const depthIndex = index + 1;
        const lineColor =
          textWhites[Math.min(depthIndex, textWhites.length - 1)];

        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              // marginLeft: `${depthIndex * 2}em`,
              whiteSpace: "pre",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: 32,
              fontWeight: 500,
              fontFamily: "serif",
              color: lineColor,
              // textShadow: "0px 0px 20px black",
            }}
          >
            {lines.slice(0, index).map((line, i) => {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    opacity: 0,
                  }}
                >
                  <Branch style={{ color: lineColor }} />{" "}
                  <div style={{ fontSize: 16 }}>{`${line.slice(0, 1)}`}</div>
                </div>
              );
            })}

            <Branch />
            {` ${text}`}
          </div>
        );
      })}
    </div>,
    {
      width: 1200,
      height,
    },
  );
}

function Branch({ style = {} }: { style?: CSSProperties }) {
  const { color = "white" } = style;

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
        height: "0.5em",
        marginTop: "-0.5em",
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
