import * as cheerio from "cheerio";

export function parseHtml(html: string):{
    title: string;
    paragraphs: string[];
}{
    const $ = cheerio.load(html);

    //Title: <title> -> <h1> -> og:title -> twitter:title -> fallback
    const title = 
    $("title").first().text().trim() || 
    $("h1").first().text().trim() ||
    $('meta[property = "og: title"]').attr("content")?.trim() ||
    $('meta[property="twitter:title"]').attr("content")?.trim() ||
    "";

    //paragraphs: all <p> tags, trimmed, non-empty only 
    const paragraphs = $("p")
    .map((_,el) => $(el).text().trim())
    .get().filter((text) => text.length > 0);

    return {title, paragraphs };
}