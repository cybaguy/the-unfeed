"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import type { ParsedArticle } from "@/src/types/article";

interface ArticleContextValue {
  articles: ParsedArticle[];
  hydrated: boolean;
  addArticle: (article: ParsedArticle) => void;
  removeArticle: (url: string) => void;
  getArticleByUrl: (url: string) => ParsedArticle | undefined;
  clearArticles: () => void;
}

const ArticleContext = createContext<ArticleContextValue | undefined>(undefined);
const STORAGE_KEY = "un-feed-articles";

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ParsedArticle[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setArticles(JSON.parse(stored));
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  function addArticle(article: ParsedArticle) {
    setArticles((prev) => {
      const exists = prev.some((a) => a.sourceUrl === article.sourceUrl);
      return exists
        ? prev.map((a) => (a.sourceUrl === article.sourceUrl ? article : a))
        : [...prev, article];
    });
  }

  function removeArticle(url: string) {
    setArticles((prev) => prev.filter((a) => a.sourceUrl !== url));
  }

  function getArticleByUrl(url: string) {
    return articles.find((a) => a.sourceUrl === url);
  }

  function clearArticles() {
    setArticles([]);
  }

  return (
    <ArticleContext.Provider
      value={{ articles, hydrated, addArticle, removeArticle, getArticleByUrl, clearArticles }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticles must be used within ArticleProvider");
  }
  return context;
}