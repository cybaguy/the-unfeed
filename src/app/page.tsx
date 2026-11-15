"use client";

import { UrlInput } from "@/src/components/UrlInput";
import { ArticleList } from "@/src/components/ArticleList";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-6 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          The Un-Feed
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Paste a URL. Read without the noise.
        </p>

        <UrlInput />

        <div className="mt-16">
          <ArticleList />
        </div>
      </div>
    </main>
  );
}