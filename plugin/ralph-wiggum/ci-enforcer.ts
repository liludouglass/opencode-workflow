/**
 * CI Enforcer - Runs CI checks and enforces green status
 * 
 * Executes type-check, lint, test, and optional build commands.
 * Returns pass/fail results for each check.
 * Supports configurable commands per project.
 */

import type { OpenCodeClient, ShellFunction } from "./types"

export interface CIConfig {
  typeCheck: string
  lint: string
  test: string
  build?: string
}

export interface CIResult {
  passed: boolean
  results: Map<string, boolean>
}

export class CIEnforcer {
  constructor(
    private config: CIConfig,
    private shell: ShellFunction,
    private client?: OpenCodeClient
  ) {}

  /**
   * Run all CI checks and return results
   */
  async enforce(workdir: string): Promise<CIResult> {
    const results = new Map<string, boolean>()
    let allPassed = true

    // Run type check
    const typeCheckPassed = await this.runCheck("type-check", this.config.typeCheck, workdir)
    results.set("type-check", typeCheckPassed)
    if (!typeCheckPassed) allPassed = false

    // Run lint
    const lintPassed = await this.runCheck("lint", this.config.lint, workdir)
    results.set("lint", lintPassed)
    if (!lintPassed) allPassed = false

    // Run tests
    const testPassed = await this.runCheck("test", this.config.test, workdir)
    results.set("test", testPassed)
    if (!testPassed) allPassed = false

    // Run build if configured
    if (this.config.build) {
      const buildPassed = await this.runCheck("build", this.config.build, workdir)
      results.set("build", buildPassed)
      if (!buildPassed) allPassed = false
    }

    return {
      passed: allPassed,
      results
    }
  }

  /**
   * Run a single CI check command
   */
  private async runCheck(name: string, command: string, workdir: string): Promise<boolean> {
    try {
      // Use shell with proper command execution
      const result = await this.shell`cd ${workdir} && ${command}`

      // Check exit code
      return result.exitCode === 0
    } catch (error) {
      // Command failed or timed out
      if (this.client) {
        try {
          await this.client.app.log({
            body: {
              service: "ralph-wiggum",
              level: "error",
              message: `CI check '${name}' failed`,
              extra: { error: error instanceof Error ? error.message : String(error), workdir, command }
            }
          })
        } catch (logError) {
          // Ignore logging errors
        }
      }
      return false
    }
  }

  /**
   * Update CI configuration
   */
  updateConfig(newConfig: Partial<CIConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current CI configuration
   */
  getConfig(): CIConfig {
    return { ...this.config }
  }
}