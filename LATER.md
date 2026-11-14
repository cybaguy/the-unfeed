# LATER — Deferred Ideas and Improvements

## Security
- DNS rebinding defense: resolve hostname to IP, block private IPs by IP (not hostname)
- Rate limiting on /api/parse (prevent scraping infrastructure abuse)
- Public IPv6 allowlist (currently all IPv6 is blocked)

## Parser
- Upgrade to Mozilla Readability.js for JS-heavy sites and paywalls
- Support for `<article>` tags as fallback when `<p>` extraction is thin
- Preserve `<a>` links in V2

## API
- Cache parsed articles (avoid re-parsing same URL)
- Support for `Accept` header negotiation (JSON vs. raw HTML response)
- Streaming parse for large pages (avoid loading full HTML into memory)

## V2 — Planned upgrades (from 2026-11-14 conversation)

### Persistence
- Replace sessionStorage with localStorage
- Cap stored articles at N (e.g., 20), evict oldest first (LRU)
- Keep the Context API contract unchanged — only the storage backend swaps

### Parser
- Integrate Mozilla Readability.js for non-`<p>` content (PG essays, HN threads)
- Should lift real-URL success from ~14% fail to ~85% success
- Keep the current `<p>`-only parser as fallback if Readability returns nothing

### UI
- Dark mode toggle (Tailwind dark: classes + localStorage persistence)
- Typography controls (font size, line height)
- Reading progress indicator (scroll position)
- Estimated "time saved" vs. reading the original ad-laden page

## V2 — Planned upgrades (from 2026-11-14 conversation)

### Persistence
- Replace sessionStorage with localStorage
- Cap stored articles at N (e.g., 20), evict oldest first (LRU)
- Keep the Context API contract unchanged — only the storage backend swaps

### Parser
- Integrate Mozilla Readability.js for non-`<p>` content (PG essays, HN threads)
- Should lift real-URL success from ~14% fail to ~85% success
- Keep the current `<p>`-only parser as fallback if Readability returns nothing

### UI
- Dark mode toggle (Tailwind dark: classes + localStorage persistence)
- Typography controls (font size, line height)
- Reading progress indicator (scroll position)
- Estimated "time saved" vs. reading the original ad-laden page
