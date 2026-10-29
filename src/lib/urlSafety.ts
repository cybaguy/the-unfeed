/**
 * Validates a URL for server-side fetching, guarding against SSRF attacks.
 * NOTE - This is a *blocklist* not an *allowlist*. It stops naive attacks
 * but cannot prevent DNS rebinding or redirect-based bypasses.
 * In production, it should be paired with network-level controls
 * (IMDSv2, egress firewall).
 */

export function isSafeUrl(rawUrl: string):{safe: true} | {safe: false; reason: string}{
let parsed: URL;
try{
    parsed = new URL(rawUrl);
}catch{
    return{ safe: false, reason: "Invalid URL format"};
}

if (parsed.protocol !== "http:" && parsed.protocol !== "https:"){
    return {safe:false, reason: "only HTTP and HTTPS URLs are allowed"};
}
const host= parsed.hostname.toLowerCase();

const blockedPatterns = [
    /^localhost$/,
    /^127\./,
    /^0\.0\.0\.0s/,
    /^169\.254\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9][2/d|3[01])\./,
    /^\[::1\]$/,
    /\.internal$/,
    /\.local$/,
];

if (blockedPatterns.some((pattern) => pattern.test(host))){
    return {safe: false, reason : "URL points to a blocked address"};
}
return {safe: true};
}