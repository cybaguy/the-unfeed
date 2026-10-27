/** 
 * Average adult reading speed, in words per minute.
 *Source: commonly-cited figure used by Medium. Readability,etc. 
*/

const WORDS_PER_MINUTE = 225;

/**
 * Count words in a piece of text
 * Splits on any whitespace (/s+) and filters out empty strings
 * caused by leading/trailing/double spaces.
 */
export function countWords(text: string): number {
    const trimmed = text.trim();
    if (trimmed === "") return 0;
    return trimmed.split(/\s+/).length;
}

/** 
 * Estimate reading time in whole minutes.
 * Always returns at least 1 (so even a 5-word title shows "1 min read").
*/
export function calculateReadingTime(wordCount: number): number {
    return Math.max(1, Math.ceil(wordCount/WORDS_PER_MINUTE));
}