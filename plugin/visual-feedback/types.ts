/**
 * Types for Visual Feedback Plugin
 */

export interface VisualCaptureOptions {
  /** URL to capture */
  url: string;
  /** Optional selector to wait for before capture */
  waitForSelector?: string;
  /** Optional timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Whether to capture full page (default: true) */
  fullPage?: boolean;
  /** Optional viewport width (default: 1280) */
  viewportWidth?: number;
  /** Optional viewport height (default: 720) */
  viewportHeight?: number;
  /** Optional device to emulate (e.g., 'iPhone 12', 'iPad Pro') */
  device?: string;
  /** Whether to capture console logs (default: true) */
  captureConsole?: boolean;
  /** Whether to capture network errors (default: true) */
  captureNetworkErrors?: boolean;
  /** Optional actions to perform before capture */
  actions?: VisualAction[];
  /** Output directory for screenshots (default: .opencode/visual-feedback/) */
  outputDir?: string;
}

export interface VisualAction {
  /** Type of action */
  type: 'click' | 'fill' | 'select' | 'hover' | 'scroll' | 'wait';
  /** Selector for the element */
  selector?: string;
  /** Value for fill/select actions */
  value?: string;
  /** Delay in ms for wait action */
  delay?: number;
  /** Scroll position for scroll action */
  scrollTo?: { x?: number; y?: number };
}

export interface ConsoleMessage {
  /** Message type: log, warn, error, info, debug */
  type: string;
  /** Message text */
  text: string;
  /** Timestamp */
  timestamp: string;
  /** Source URL if available */
  url?: string;
  /** Line number if available */
  lineNumber?: number;
}

export interface NetworkError {
  /** Request URL */
  url: string;
  /** HTTP status code */
  status?: number;
  /** Error message */
  error: string;
  /** Request method */
  method: string;
  /** Timestamp */
  timestamp: string;
}

export interface VisualCaptureResult {
  /** Whether capture was successful */
  success: boolean;
  /** Path to screenshot file */
  screenshotPath?: string;
  /** Base64 encoded screenshot (for inline viewing) */
  screenshotBase64?: string;
  /** Console messages captured */
  consoleLogs: ConsoleMessage[];
  /** Network errors captured */
  networkErrors: NetworkError[];
  /** Page title */
  pageTitle?: string;
  /** Current URL (may differ from input if redirected) */
  finalUrl?: string;
  /** Viewport dimensions used */
  viewport: { width: number; height: number };
  /** Capture timestamp */
  timestamp: string;
  /** Error message if capture failed */
  error?: string;
  /** Duration of capture in ms */
  durationMs: number;
}

export interface CompareOptions {
  /** Path to baseline screenshot */
  baselinePath: string;
  /** Path to current screenshot */
  currentPath: string;
  /** Threshold for pixel difference (0-1, default: 0.1) */
  threshold?: number;
  /** Output path for diff image */
  diffOutputPath?: string;
}

export interface CompareResult {
  /** Whether images match within threshold */
  match: boolean;
  /** Percentage of pixels that differ */
  diffPercentage: number;
  /** Path to diff image if generated */
  diffImagePath?: string;
  /** Number of different pixels */
  diffPixelCount: number;
  /** Total pixels compared */
  totalPixels: number;
}

export interface VisualFeedbackConfig {
  /** Default browser to use (chromium, firefox, webkit) */
  browser: 'chromium' | 'firefox' | 'webkit';
  /** Whether to run headless (default: true) */
  headless: boolean;
  /** Default timeout in ms */
  defaultTimeout: number;
  /** Default viewport */
  defaultViewport: { width: number; height: number };
  /** Screenshot output directory */
  outputDir: string;
  /** Whether to keep browser open between captures */
  reuseContext: boolean;
}
