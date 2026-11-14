# LOOPHOLES — Noticed Problems Not Yet Fixed

## 2026-11-14 — Redirect re-check verification

**Status:** Code verified by inspection. Live test blocked.

**Issue:** Cannot test that `/api/parse` re-checks `isSafeUrl` on every redirect hop, because both `httpbin.org/redirect-to` and `httpbingo.org/redirect-to` return 403 when the target is a private IP (they filter SSRF attempts server-side).

**Code proof:** The safety check runs inside the `while (true)` loop, so `isSafeUrl(currentUrl)` executes on every iteration — including after `currentUrl` is reassigned to a redirect target. Structurally correct.

**Future test approach:** Add a local test route `/api/test-redirect` that returns a 302 to `169.254.169.254`, verify `/api/parse` blocks it with 400, then delete the test route. Not blocking V1.

**Impact:** None for functionality. Only affects confidence in test coverage.

## 2026-11-14 — Real URL sweep (10 URLs tested)

**Summary:** 3 PASS, 3 SOFT-FAIL, 1 interesting fail, 3 invalid tests (URLs 404'd).

### PASS (parser works as designed)
- `en.wikipedia.org/wiki/Next.js` — 18 paragraphs, 1195 words ✅
- `simonwillison.net/2024/Dec/31/llms-in-2024/` — ~80 paragraphs, 5897 words ✅
- `github.com/vercel/next.js` — 10 paragraphs, 218 words ✅

### SOFT-FAIL (expected, no fix in V1)
- `paulgraham.com/greatwork.html` — 422 "No readable content." PG essays use `<font>` tags in layout tables, no `<p>` tags. **Readability.js would catch this in V2.**
- `news.ycombinator.com/item?id=...` — 422. HN comments are `<td>`/`<div>`, no `<p>` tags. Expected.
- `medium.com/@...` — 403 Forbidden. Medium blocks scrapers server-side. Not a parser problem.

### INTERESTING FAIL
- `xkcd.com/` — 502 "Failed to reach URL" (not 422). Likely 8-second timeout too tight for some sites. Consider bumping `FETCH_TIMEOUT_MS` to 10000 in V1.1.

### INVALIetry with current URLs)
- `blog.cloudflare.com/...` — 404
- `bbc.com/news/articles/...` — 404
- `theverge.com/...` — 404

### Decision
No immediate fixes required. Parser handles the sweet-spot content well. Readability.js upgrade (already in LATER.md) covers the PG/HN class of failures. Timeout bump deferred to V1.1.
