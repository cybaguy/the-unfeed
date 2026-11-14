# LOOPHOLES — Noticed Problems Not Yet Fixed

## 2026-11-14 — Redirect re-check verification

**Status:** Code verified by inspection. Live test blocked.

**Issue:** Cannot test that `/api/parse` re-checks `isSafeUrl` on every redirect hop, because both `httpbin.org/redirect-to` and `httpbingo.org/redirect-to` return 403 when the target is a private IP (they filter SSRF attempts server-side).

**Code proof:** The safety check runs inside the `while (true)` loop, so `isSafeUrl(currentUrl)` executes on every iteration — including after `currentUrl` is reassigned to a redirect target. Structurally correct.

**Future test approach:** Add a local test route `/api/test-redirect` that returns a 302 to `169.254.169.254`, verify `/api/parse` blocks it with 400, then delete the test route. Not blocking V1.

**Impact:** None for functionality. Only affects confidence in test coverage.
