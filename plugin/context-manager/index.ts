import { BundleGenerator } from './bundle-generator.js';
import { TokenCounter } from './token-counter.js';
import { ContextBundle } from './types.js';

/**
 * OpenCode Context Manager Plugin
 * 
 * Generates minimal context bundles for tasks following the Ralph Wiggum pattern
 * of fresh context per iteration.
 */
export default class ContextManagerPlugin {
  private bundleGenerator: BundleGenerator;

  constructor() {
    this.bundleGenerator = new BundleGenerator();
    console.log('[ContextManager] Plugin initialized - Ralph Wiggum pattern enabled');
  }

  /**
   * Plugin metadata
   */
  static get metadata() {
    return {
      name: 'context-manager',
      version: '1.0.0',
      description: 'Context bundle generator for Ralph Wiggum pattern - fresh context per iteration',
      tools: ['context_generate', 'context_get_tokens']
    };
  }

  /**
   * Get available tools
   */
  getTools() {
    return {
      context_generate: {
        description: 'Generate minimal context bundle for a specific task',
        parameters: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              description: 'The task ID to generate context for (e.g., TASK-001)'
            },
            featureDir: {
              type: 'string',
              description: 'Path to the feature directory containing spec.md, tasks.md, etc.'
            },
            maxTokens: {
              type: 'number',
              description: 'Maximum tokens for the context bundle (default: 8000)',
              default: 8000
            },
            progressHistory: {
              type: 'number',
              description: 'Number of recent progress entries to include (default: 10)',
              default: 10
            }
          },
          required: ['taskId', 'featureDir']
        },
        handler: this.generateContext.bind(this)
      },

      context_get_tokens: {
        description: 'Get token count for given text',
        parameters: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text to count tokens for'
            }
          },
          required: ['text']
        },
        handler: this.getTokenCount.bind(this)
      }
    };
  }

  /**
   * Generate context bundle for a task
   */
  async generateContext(params: {
    taskId: string;
    featureDir: string;
    maxTokens?: number;
    progressHistory?: number;
  }): Promise<ContextBundle> {
    const { taskId, featureDir, maxTokens = 8000, progressHistory = 10 } = params;
    
    console.log(`[ContextManager] Generating context bundle for ${taskId} in ${featureDir}`);
    console.log(`[ContextManager] Token budget: ${maxTokens}, Progress history: ${progressHistory}`);
    
    // Create bundle generator with specified parameters
    const generator = new BundleGenerator(maxTokens, progressHistory);
    
    try {
      const bundle = await generator.generate(taskId, featureDir);
      
      console.log(`[ContextManager] Generated bundle: ${bundle.totalTokens} tokens`);
      console.log(`[ContextManager] - Spec sections: ${bundle.specSections.length}`);
      console.log(`[ContextManager] - Acceptance criteria: ${bundle.acceptanceCriteria.length}`);
      console.log(`[ContextManager] - Files to modify: ${bundle.filesToModify.length}`);
      console.log(`[ContextManager] - Progress entries: ${bundle.recentProgress.length}`);
      
      return bundle;
    } catch (error) {
      console.error(`[ContextManager] Error generating context bundle:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate context bundle for ${taskId}: ${errorMessage}`);
    }
  }

  /**
   * Get token count for text
   */
  async getTokenCount(params: { text: string }): Promise<{ tokens: number }> {
    const { text } = params;
    const tokens = TokenCounter.estimateTokens(text);
    
    console.log(`[ContextManager] Token count: ${tokens} for ${text.length} characters`);
    
    return { tokens };
  }
}

// Export the plugin class and types
export { ContextBundle, BundleGenerator, TokenCounter };
export type { ContextBundle as IContextBundle };