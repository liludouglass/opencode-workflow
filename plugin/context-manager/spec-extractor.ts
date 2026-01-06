import * as fs from 'fs';
import * as path from 'path';
import { SpecSection, AcceptanceCriterion, TaskInfo } from './types.js';

/**
 * Extracts relevant spec sections for a specific task
 */
export class SpecExtractor {
  /**
   * Parse markdown file and extract sections with headers
   */
  private parseMarkdownSections(content: string): SpecSection[] {
    const lines = content.split('\n');
    const sections: SpecSection[] = [];
    let currentSection: SpecSection | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headerMatch) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        
        // Start new section
        const level = headerMatch[1].length;
        const title = headerMatch[2];
        currentSection = { title, content: '', level };
        currentContent = [line]; // Include the header in content
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Add final section
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Extract task information from tasks.md
   */
  private parseTaskInfo(tasksContent: string, taskId: string): TaskInfo | null {
    const lines = tasksContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for task ID pattern like "- [ ] TASK-001: Description"
      const taskMatch = line.match(/^-\s*\[.\]\s*([A-Z]+-\d+):\s*(.+)$/);
      
      if (taskMatch && taskMatch[1] === taskId) {
        const description = taskMatch[2];
        
        // Look for additional task details in following lines
        let complexity = 'medium';
        let dependencies: string[] = [];
        let files: string[] = [];
        
        // Parse indented details under the task
        for (let j = i + 1; j < lines.length; j++) {
          const detailLine = lines[j];
          
          // Stop if we hit another task or non-indented line
          if (!detailLine.startsWith('  ') || detailLine.match(/^-\s*\[.\]/)) {
            break;
          }
          
          const complexityMatch = detailLine.match(/complexity:\s*(\w+)/i);
          if (complexityMatch) {
            complexity = complexityMatch[1].toLowerCase();
          }
          
          const depsMatch = detailLine.match(/depends:\s*(.+)/i);
          if (depsMatch) {
            dependencies = depsMatch[1].split(',').map(d => d.trim());
          }
          
          const filesMatch = detailLine.match(/files:\s*(.+)/i);
          if (filesMatch) {
            files = filesMatch[1].split(',').map(f => f.trim());
          }
        }
        
        return {
          id: taskId,
          description,
          complexity,
          dependencies,
          files
        };
      }
    }
    
    return null;
  }

  /**
   * Extract acceptance criteria relevant to a task
   */
  private parseAcceptanceCriteria(acceptanceContent: string, taskId: string): AcceptanceCriterion[] {
    const lines = acceptanceContent.split('\n');
    const criteria: AcceptanceCriterion[] = [];
    
    for (const line of lines) {
      // Look for acceptance criteria patterns like "- [ ] AC-001: Description"
      const acMatch = line.match(/^-\s*\[.\]\s*(AC-\d+):\s*(.+)$/);
      
      if (acMatch) {
        const id = acMatch[1];
        const description = acMatch[2];
        
        // Check if this AC is related to the task (by convention or explicit mention)
        const isRelevant = description.toLowerCase().includes(taskId.toLowerCase()) ||
                          this.isAcceptanceCriteriaRelevantToTask(description, taskId);
        
        if (isRelevant) {
          criteria.push({
            id,
            description,
            taskId
          });
        }
      }
    }
    
    return criteria;
  }

  /**
   * Determine if an acceptance criterion is relevant to a specific task
   * This is a heuristic-based approach that can be enhanced
   */
  private isAcceptanceCriteriaRelevantToTask(acDescription: string, taskId: string): boolean {
    // Extract task number for pattern matching
    const taskNumber = taskId.match(/\d+$/)?.[0];
    if (!taskNumber) return false;
    
    // Look for task number in AC description
    if (acDescription.includes(taskNumber)) return true;
    
    // Add more sophisticated matching logic here as needed
    // For now, assume all ACs are potentially relevant
    return true;
  }

  /**
   * Find spec sections relevant to a task based on keywords and context
   */
  private findRelevantSpecSections(sections: SpecSection[], taskInfo: TaskInfo): SpecSection[] {
    const relevantSections: SpecSection[] = [];
    const taskKeywords = this.extractKeywords(taskInfo.description);
    
    // Create regex pattern for efficient keyword matching
    const keywordPattern = taskKeywords.length > 0 
      ? new RegExp(taskKeywords.join('|'), 'i')
      : null;
    
    for (const section of sections) {
      const sectionText = (section.title + ' ' + section.content).toLowerCase();
      
      // Check if section contains task-related keywords
      const hasRelevantKeywords = keywordPattern ? keywordPattern.test(sectionText) : false;
      
      // Include high-level sections (overview, architecture, etc.)
      const isHighLevel = section.level <= 2;
      
      // Include sections that mention files the task will modify
      const mentionsTaskFiles = taskInfo.files.some(file => 
        sectionText.includes(file.toLowerCase())
      );
      
      if (hasRelevantKeywords || isHighLevel || mentionsTaskFiles) {
        relevantSections.push(section);
      }
    }
    
    return relevantSections;
  }

  /**
   * Extract keywords from task description for relevance matching
   */
  private extractKeywords(description: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP
    const words = description.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter out short words
    
    // Remove common stop words
    const stopWords = ['with', 'from', 'that', 'this', 'will', 'have', 'been', 'were', 'they', 'them'];
    return words.filter(word => !stopWords.includes(word));
  }

  /**
   * Extract relevant spec sections for a specific task
   */
  async extractForTask(featureDir: string, taskId: string): Promise<{
    specSections: string[];
    acceptanceCriteria: string[];
    taskInfo: TaskInfo | null;
  }> {
    const specPath = path.join(featureDir, 'spec.md');
    const acceptancePath = path.join(featureDir, 'acceptance.md');
    const tasksPath = path.join(featureDir, 'tasks.md');
    
    let specSections: string[] = [];
    let acceptanceCriteria: string[] = [];
    let taskInfo: TaskInfo | null = null;
    
    // Extract task information
    if (fs.existsSync(tasksPath)) {
      try {
        const tasksContent = fs.readFileSync(tasksPath, 'utf-8');
        taskInfo = this.parseTaskInfo(tasksContent, taskId);
      } catch (error) {
        console.warn(`Failed to read ${tasksPath}: ${error}`);
        taskInfo = null;
      }
    }
    
    // Extract relevant spec sections
    if (fs.existsSync(specPath) && taskInfo) {
      try {
        const specContent = fs.readFileSync(specPath, 'utf-8');
        const allSections = this.parseMarkdownSections(specContent);
        const relevantSections = this.findRelevantSpecSections(allSections, taskInfo);
        specSections = relevantSections.map(section => section.content);
      } catch (error) {
        console.warn(`Failed to read ${specPath}: ${error}`);
        specSections = [];
      }
    }
    
    // Extract relevant acceptance criteria
    if (fs.existsSync(acceptancePath)) {
      try {
        const acceptanceContent = fs.readFileSync(acceptancePath, 'utf-8');
        const criteria = this.parseAcceptanceCriteria(acceptanceContent, taskId);
        acceptanceCriteria = criteria.map(ac => `${ac.id}: ${ac.description}`);
      } catch (error) {
        console.warn(`Failed to read ${acceptancePath}: ${error}`);
        acceptanceCriteria = [];
      }
    }
    
    return {
      specSections,
      acceptanceCriteria,
      taskInfo
    };
  }
}