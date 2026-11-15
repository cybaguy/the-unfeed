"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useArticles } from "@/src/context/ArticleContext";
import type { ParsedArticle } from "@/src/types/article";

// Inner component that uses the hook
function ReadView() {
  const params = useParams();
  const router = useRouter();
  const { getArticleByUrl } = useArticles();
  const [article, setArticle] = useState<ParsedArticle | null>(null);
  const [mounted, setMounted] = useState(false);

  const urlParam = decodeURIComponent(params.url as string);

  useEffect(() => {
    setMounted(true);
    const found = getArticleByUrl(urlParam);
    if (found) {
      setArticle(found);
    } else {
      const timer = setTimeout(() => {
        const retry = getArticleByUrl(urlParam);
        if (!retry) router.push("/");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [urlParam]);

  if (!mounted) return null;

  if (!article) {
    return (
      <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <div className="max-w-[65ch] mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-block mb-10 text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back
        </Link>
        <article>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {article.title || "Untitled"}
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            {article.estimatedMinutes} min read · {article.wordCount} words
          </p>
          <div className="space-y-5 text-lg leading-relaxed text-gray-800">
            {article.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}

// Server-ish wrapper with Suspense
export default function ReadPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    }>
      <ReadView />
    </Suspense>
  );
}