"use client";

import { UrlInput } from "@/src/components/UrlInput";
import { ArticleList } from "@/src/components/ArticleList";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 md:px-6 md:py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Made title responsive: text-4xl on mobile, text-5xl on desktop */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          The Un-Feed
        </h1>
        <p className="text-lg text-gray-600 mb-8 md:mb-10">
          Paste a URL. Read without the noise.
        </p>

        <UrlInput />

        <div className="mt-12 md:mt-16">
          <ArticleList />
        </div>
      </div>
    </main>
  );
}