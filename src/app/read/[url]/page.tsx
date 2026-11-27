"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useArticles } from "@/src/context/ArticleContext";
import type { ParsedArticle } from "@/src/types/article";

function ReadView() {
  const params = useParams();
  const router = useRouter();
  const { getArticleByUrl, hydrated } = useArticles();
  const [article, setArticle] = useState<ParsedArticle | null>(null);

  const urlParam = decodeURIComponent(params.url as string);

  useEffect(() => {
    if (!hydrated) return;
    const found = getArticleByUrl(urlParam);
    if (found) {
      setArticle(found);
    } else {
      router.push("/");
    }
  }, [urlParam, hydrated, getArticleByUrl, router]);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

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

export default function ReadPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      }
    >
      <ReadView />
    </Suspense>
  );
}