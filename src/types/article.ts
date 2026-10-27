export interface ParsedArticle {
    title: string;
    sourceUrl: string;
    paragraphs: string[];
    estimatedMinutes: number;
    wordCount: number;
}