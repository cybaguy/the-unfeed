import { isSafeUrl } from "@/src/lib/urlSafety";
import { parseHtml } from "@/src/lib/parseHtml";
import { countWords, calculateReadingTime } from "@/src/lib/readingTime";
import { ParsedArticle } from "@/src/types/article";

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 8000;
const MAX_RESPONSE_BYTES = 5_000_000;

export async function POST(request: Request) {
  // Fix #6 — JSON try/catch
  let rawBody: { url?: string };
  try {
    rawBody = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (typeof rawBody?.url !== "string" || rawBody.url.trim() === "") {
    return Response.json(
      { error: "URL is missing or invalid" },
      { status: 400 }
    );
  }

  let currentUrl = rawBody.url;
  let response: Response;
  let redirectCount = 0;

  // Fix #4 — manual redirects with per-hop safety check
  while (true) {
    const safetyCheck = isSafeUrl(currentUrl);
    if (!safetyCheck.safe) {
      return Response.json(
        { error: safetyCheck.reason },
        { status: 400 }
      );
    }

    // Fix #5 — timeout
    try {
      response = await fetch(currentUrl, {
        redirect: "manual",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
    } catch (err) {
      console.error("Fetch failed:", err);
      return Response.json(
        { error: "Failed to reach URL" },
        { status: 502 }
      );
    }

    if (response.status < 300 || response.status >= 400) {
      break;
    }

    redirectCount++;
    if (redirectCount > MAX_REDIRECTS) {
      return Response.json(
        { error: `Too many redirects (max ${MAX_REDIRECTS})` },
        { status: 508 }
      );
    }

    const location = response.headers.get("location");
    if (!location) {
      return Response.json(
        { error: "Redirect without location header" },
        { status: 502 }
      );
    }

    try {
      currentUrl = new URL(location, currentUrl).toString();
    } catch {
      return Response.json(
        { error: "Invalid redirect URL" },
        { status: 502 }
      );
    }
  }

  if (!response.ok) {
    return Response.json(
      { error: `Failed to fetch URL (status ${response.status})` },
      { status: 502 }
    );
  }

  // Fix #5 — response size cap
  const contentLength = response.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_BYTES) {
    return Response.json(
      { error: "Page too large to process (max 5 MB)" },
      { status: 413 }
    );
  }

  // Fix #7 — content-type check
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return Response.json(
      { error: `URL does not point to an HTML page (got ${contentType || "unknown"})` },
      { status: 415 }
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

  const text = paragraphs.join(" ");
  const wordCount = countWords(text);
  const estimatedMinutes = calculateReadingTime(wordCount);

  const article: ParsedArticle = {
    title,
    paragraphs,
    wordCount,
    estimatedMinutes,
    sourceUrl: currentUrl,
  };

  return Response.json({ article });
}