"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useArticles } from "@/src/context/ArticleContext";
import type { ParsedArticle } from "@/src/types/article";

export function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addArticle, getArticleByUrl } = useArticles();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }

    // Already saved? Redirect directly (Option B from earlier decision)
    const existing = getArticleByUrl(trimmed);
    if (existing) {
      router.push(`/read/${encodeURIComponent(trimmed)}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      const article: ParsedArticle = data.article;
      addArticle(article);
      router.push(`/read/${encodeURIComponent(article.sourceUrl)}`);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          disabled={loading}
          className="flex-1 px-5 py-4 text-lg rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-4 text-lg font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Un-Feed It"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}