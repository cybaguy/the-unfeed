import { isSafeUrl } from "@/src/lib/urlSafety";
import { parseHtml } from "@/src/lib/parseHtml";

export async function POST(request: Request) {
  const rawBody = await request.json();

  if (typeof rawBody?.url !== "string" || rawBody.url?.trim() === "") {
    return Response.json(
      { error: "URL is missing or invalid" },
      { status: 400 }
    );
  }

  const safetyCheck = isSafeUrl(rawBody.url);
  if (!safetyCheck.safe) {
    return Response.json(
      { error: safetyCheck.reason },
      { status: 400 }
    );
  }

  let response: Response;
  try {
    response = await fetch(rawBody.url);
  } catch (err) {
    console.error("Fetch failed:", err);
    return Response.json(
      { error: "Failed to reach URL" },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return Response.json(
      { error: `Failed to fetch URL (status ${response.status})` },
      { status: 502 }
    );
  }

  const html = await response.text();

  let parsed: { title: string; paragraphs: string[] };
  try {
    parsed = parseHtml(html);
  } catch (err) {
    console.error("HTML parsing failed:", err);
    return Response.json(
      { error: "Failed to parse page content" },
      { status: 500 }
    );
  }

  const { title, paragraphs } = parsed;

  if (paragraphs.length === 0) {
    return Response.json(
      { error: "No readable content found on this page" },
      { status: 422 }
    );
  }

  return Response.json({
    received: {
      url: rawBody.url,
      title,
      paragraphCount: paragraphs.length,
      firstParagraphPreview: paragraphs[0]?.slice(0, 100),
    },
  });
}