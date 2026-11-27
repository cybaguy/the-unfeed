# The Un-Feed

A minimalist, distraction-free content curator. Paste a messy article URL, and read only the text—no ads, no popups, no infinite scrolling.

**Live Demo:** [https://the-unfeed.vercel.app](https://the-unfeed.vercel.app)

## 📱 Screenshots

| Landing Page | Reading View |
| :---: | :---: |
| *(Insert mobile screenshot here)* | *(Insert reading view screenshot here)* |

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS
- **Parsing Engine:** Cheerio (Server-side)
- **State Management:** React Context + `sessionStorage`
- **Security:** Custom SSRF protection (blocks localhost, private IPs, IPv6, and redirect bypasses)

## 🧠 Architecture Highlights
- **Server-side Parsing:** Raw HTML is fetched and stripped on the server to avoid CORS issues and protect the client from malicious payloads.
- **Ephemeral State:** Saved articles live in `sessionStorage`. They survive page refreshes, but vanish when the tab is closed (privacy by design).
- **Error Resilience:** Handles malformed JSON, non-HTML pages, SSRF attempts, and timeouts with clean, typed HTTP status codes (400, 413, 415, 422, 502).