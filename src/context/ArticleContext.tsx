"use client";

import {createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ParsedArticle } from "@/src/types/article";

// Block 1: Contract
interface ArticleContextValue {
    articles: ParsedArticle[];
    addArticle: (article: ParsedArticle) => void;
    removeArticle: (url: string) => void;
    getArticleByUrl: (url: string) => ParsedArticle | undefined;
    clearArticles: () => void;
}

// Block 2: The Empty Frame
const ArticleContext = createContext<ArticleContextValue | undefined>(undefined);

const STORAGE_KEY = "un-feed-articles";

//Block 3: the Provider
export function ArticleProvider({children}: {children: ReactNode}){
    const [articles, setArticles] = useState<ParsedArticle[]>([]);

    //Load from sessionstorage once on mount
    useEffect(() =>{
        try{
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                setArticles(JSON.parse(stored));
            
            }
        } catch{
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    //Save to sessionStorage on every change
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(articles));

    }, [articles]);

    function addArticle(article: ParsedArticle){
        setArticles((prev) => {
            const exists = prev.some((a) => a.sourceUrl === article.sourceUrl);
            return exists
            ? prev.map((a)=> (a.sourceUrl === article.sourceUrl ? article: a))
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
        <ArticleContext.Provider value={{articles, addArticle, removeArticle, getArticleByUrl, clearArticles}}  >
            {children}
        </ArticleContext.Provider>

    );
}

//Block 4: The Hook
export function useArticles() {
    const context = useContext(ArticleContext);
    if(!context) {
        throw new Error("useArticles must be used within articleProvider");
    }
    return context;
}

