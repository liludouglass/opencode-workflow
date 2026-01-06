export interface ContextBundle {
  taskId: string;
  specSections: string[];
  acceptanceCriteria: string[];
  filesToModify: string[];
  recentProgress: string[];
  totalTokens: number;
}

export interface TaskInfo {
  id: string;
  description: string;
  complexity: string;
  dependencies: string[];
  files: string[];
}

export interface SpecSection {
  title: string;
  content: string;
  level: number;
}

export interface ProgressEntry {
  timestamp: string;
  taskId: string;
  iteration: number;
  agent: string;
  action: string;
  files: string[];
  tests: string;
  commit: string;
  status: string;
}

export interface AcceptanceCriterion {
  id: string;
  description: string;
  taskId?: string;
}