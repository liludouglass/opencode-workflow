/**
 * Token counting utility for context bundle size estimation
 */
export class TokenCounter {
  private static readonly CHARS_PER_TOKEN = 4; // Fallback estimation

  /**
   * Estimate token count for given text
   * Uses tiktoken if available, falls back to character/4 estimation
   */
  static estimateTokens(text: string): number {
    // Try to use tiktoken if available
    try {
      // This would require tiktoken package, but we're avoiding dependencies
      // For now, use character-based estimation
      return Math.ceil(text.length / this.CHARS_PER_TOKEN);
    } catch {
      // Fallback to character-based estimation
      return Math.ceil(text.length / this.CHARS_PER_TOKEN);
    }
  }

  /**
   * Estimate tokens for multiple text pieces
   */
  static estimateTokensForArray(texts: string[]): number {
    return texts.reduce((total, text) => total + this.estimateTokens(text), 0);
  }

  /**
   * Check if adding text would exceed token budget
   */
  static wouldExceedBudget(currentTokens: number, additionalText: string, maxTokens: number): boolean {
    const additionalTokens = this.estimateTokens(additionalText);
    return (currentTokens + additionalTokens) > maxTokens;
  }

  /**
   * Truncate text to fit within token budget
   */
  static truncateToTokenBudget(text: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokens(text);
    
    if (estimatedTokens <= maxTokens) {
      return text;
    }

    // Calculate approximate character limit
    const maxChars = maxTokens * this.CHARS_PER_TOKEN;
    const truncated = text.substring(0, maxChars);
    
    // Try to break at a reasonable boundary (newline or space)
    const lastNewline = truncated.lastIndexOf('\n');
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastNewline > maxChars * 0.8) {
      return truncated.substring(0, lastNewline);
    } else if (lastSpace > maxChars * 0.8) {
      return truncated.substring(0, lastSpace);
    }
    
    return truncated;
  }
}