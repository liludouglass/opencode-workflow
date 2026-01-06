import * as fs from 'fs';
import * as path from 'path';
import { ContextBundle, ProgressEntry, TaskInfo } from './types.js';
import { SpecExtractor } from './spec-extractor.js';
import { TokenCounter } from './token-counter.js';

/**
 * Generates minimal context bundles for tasks following Ralph Wiggum pattern
 */
export class BundleGenerator {
  private maxTokens: number;
  private progressHistory: number;
  private specExtractor: SpecExtractor;

  constructor(maxTokens: number = 8000, progressHistory: number = 10) {
    this.maxTokens = maxTokens;
    this.progressHistory = progressHistory;
    this.specExtractor = new SpecExtractor();
  }

  /**
   * Parse progress.md and extract recent entries
   */
  private parseProgressEntries(progressContent: string): ProgressEntry[] {
    const entries: ProgressEntry[] = [];
    const lines = progressContent.split('\n');
    
    let currentEntry: Partial<ProgressEntry> | null = null;
    
    for (const line of lines) {
      // Look for progress entry headers like "## [YYYY-MM-DD HH:MM] - [Task ID] - Iteration [N]"
      const headerMatch = line.match(/^##\s*\[([^\]]+)\]\s*-\s*\[([^\]]+)\]\s*-\s*Iteration\s*\[(\d+)\]/);
      
      if (headerMatch) {
        // Save previous entry if exists
        if (currentEntry && currentEntry.timestamp) {
          entries.push(currentEntry as ProgressEntry);
        }
        
        // Start new entry
        currentEntry = {
          timestamp: headerMatch[1],
          taskId: headerMatch[2],
          iteration: parseInt(headerMatch[3])
        };
      } else if (currentEntry) {
        // Parse entry details
        const agentMatch = line.match(/^Agent:\s*(.+)$/);
        if (agentMatch) {
          currentEntry.agent = agentMatch[1];
        }
        
        const actionMatch = line.match(/^Action:\s*(.+)$/);
        if (actionMatch) {
          currentEntry.action = actionMatch[1];
        }
        
        const filesMatch = line.match(/^Files:\s*(.+)$/);
        if (filesMatch) {
          currentEntry.files = filesMatch[1].split(',').map(f => f.trim());
        }
        
        const testsMatch = line.match(/^Tests:\s*(.+)$/);
        if (testsMatch) {
          currentEntry.tests = testsMatch[1];
        }
        
        const commitMatch = line.match(/^Commit:\s*(.+)$/);
        if (commitMatch) {
          currentEntry.commit = commitMatch[1];
        }
        
        const statusMatch = line.match(/^Status:\s*(.+)$/);
        if (statusMatch) {
          currentEntry.status = statusMatch[1];
        }
      }
    }
    
    // Add final entry
    if (currentEntry && currentEntry.timestamp) {
      entries.push(currentEntry as ProgressEntry);
    }
    
    return entries;
  }

  /**
   * Get recent progress entries, prioritizing the specific task
   */
  private getRecentProgress(progressEntries: ProgressEntry[], taskId: string): string[] {
    // Sort by timestamp (most recent first)
    const sortedEntries = progressEntries.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Get entries for this specific task
    const taskEntries = sortedEntries.filter(entry => entry.taskId === taskId);
    
    // Get other recent entries to provide context
    const otherEntries = sortedEntries.filter(entry => entry.taskId !== taskId);
    
    // Combine: prioritize task-specific entries, then add others up to limit
    const selectedEntries = [
      ...taskEntries.slice(0, Math.ceil(this.progressHistory * 0.7)), // 70% for task-specific
      ...otherEntries.slice(0, Math.floor(this.progressHistory * 0.3))  // 30% for context
    ].slice(0, this.progressHistory);
    
    // Format as strings
    return selectedEntries.map(entry => {
      const files = Array.isArray(entry.files) ? entry.files.join(', ') : (entry.files || '');
      return `## [${entry.timestamp}] - [${entry.taskId}] - Iteration [${entry.iteration}]
Agent: ${entry.agent || 'unknown'}
Action: ${entry.action || 'no action specified'}
Files: ${files}
Tests: ${entry.tests || 'no test info'}
Commit: ${entry.commit || 'no commit'}
Status: ${entry.status || 'unknown'}`;
    });
  }

  /**
   * Fit content within token budget using priority-based truncation
   */
  private fitWithinBudget(
    specSections: string[],
    acceptanceCriteria: string[],
    recentProgress: string[],
    filesToModify: string[]
  ): {
    specSections: string[];
    acceptanceCriteria: string[];
    recentProgress: string[];
    filesToModify: string[];
  } {
    let currentTokens = 0;
    const result = {
      specSections: [] as string[],
      acceptanceCriteria: [] as string[],
      recentProgress: [] as string[],
      filesToModify: [] as string[]
    };
    
    // Reserve tokens for each section (priority order)
    const reservedTokens = {
      acceptanceCriteria: Math.floor(this.maxTokens * 0.15), // 15% - most important
      filesToModify: Math.floor(this.maxTokens * 0.05),      // 5% - small but critical
      recentProgress: Math.floor(this.maxTokens * 0.30),     // 30% - important context
      specSections: Math.floor(this.maxTokens * 0.50)       // 50% - detailed context
    };
    
    // Add acceptance criteria (highest priority)
    for (const criterion of acceptanceCriteria) {
      if (!TokenCounter.wouldExceedBudget(currentTokens, criterion, reservedTokens.acceptanceCriteria)) {
        result.acceptanceCriteria.push(criterion);
        currentTokens += TokenCounter.estimateTokens(criterion);
      }
    }
    
    // Add files to modify (critical for implementation)
    for (const file of filesToModify) {
      if (!TokenCounter.wouldExceedBudget(currentTokens, file, currentTokens + reservedTokens.filesToModify)) {
        result.filesToModify.push(file);
        currentTokens += TokenCounter.estimateTokens(file);
      }
    }
    
    // Add recent progress (important for context)
    for (const progress of recentProgress) {
      if (!TokenCounter.wouldExceedBudget(currentTokens, progress, currentTokens + reservedTokens.recentProgress)) {
        result.recentProgress.push(progress);
        currentTokens += TokenCounter.estimateTokens(progress);
      }
    }
    
    // Add spec sections (fill remaining space)
    const remainingTokens = this.maxTokens - currentTokens;
    for (const section of specSections) {
      if (!TokenCounter.wouldExceedBudget(currentTokens, section, this.maxTokens)) {
        result.specSections.push(section);
        currentTokens += TokenCounter.estimateTokens(section);
      } else {
        // Try to fit a truncated version
        const availableTokens = this.maxTokens - currentTokens;
        if (availableTokens > 100) { // Only if we have meaningful space left
          const truncated = TokenCounter.truncateToTokenBudget(section, availableTokens);
          result.specSections.push(truncated + '\n\n[... truncated for token budget ...]');
          break; // Stop adding more sections
        }
      }
    }
    
    return result;
  }

  /**
   * Generate context bundle for a specific task
   */
  async generate(taskId: string, featureDir: string): Promise<ContextBundle> {
    // Extract spec sections and acceptance criteria
    const { specSections, acceptanceCriteria, taskInfo } = await this.specExtractor.extractForTask(featureDir, taskId);
    
    // Get files to modify from task info
    const filesToModify = taskInfo?.files || [];
    
    // Parse progress entries
    let recentProgress: string[] = [];
    const progressPath = path.join(featureDir, 'progress.md');
    if (fs.existsSync(progressPath)) {
      const progressContent = fs.readFileSync(progressPath, 'utf-8');
      const progressEntries = this.parseProgressEntries(progressContent);
      recentProgress = this.getRecentProgress(progressEntries, taskId);
    }
    
    // Fit everything within token budget
    const fitted = this.fitWithinBudget(specSections, acceptanceCriteria, recentProgress, filesToModify);
    
    // Calculate total tokens
    const totalTokens = TokenCounter.estimateTokensForArray([
      ...fitted.specSections,
      ...fitted.acceptanceCriteria,
      ...fitted.recentProgress,
      ...fitted.filesToModify
    ]);
    
    return {
      taskId,
      specSections: fitted.specSections,
      acceptanceCriteria: fitted.acceptanceCriteria,
      filesToModify: fitted.filesToModify,
      recentProgress: fitted.recentProgress,
      totalTokens
    };
  }
}