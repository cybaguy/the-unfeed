"use client";

import Link from "next/link";
import { useArticles } from "@/src/context/ArticleContext";

export function ArticleList() {
  const { articles, removeArticle } = useArticles();

  if (articles.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No articles yet. Paste a URL above to get started.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Your Reading List
      </h2>
      <ul className="space-y-3">
        {articles.map((article) => (
          <li
            key={article.sourceUrl}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
          >
            <Link
              href={`/read/${encodeURIComponent(article.sourceUrl)}`}
              className="flex-1 min-w-0"
            >
              <h3 className="font-semibold text-gray-900 truncate">
                {article.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {article.estimatedMinutes} min read · {article.wordCount} words
              </p>
            </Link>
            <button
              onClick={() => removeArticle(article.sourceUrl)}
              className="text-gray-400 hover:text-red-600 transition-colors px-2 py-1"
              aria-label="Remove article"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}