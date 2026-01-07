# Approach: Ticket Integration Workflow Enhancement

## Request Type

feature

## Complexity

complex

## Summary

This feature enhances the OpenCode agentic workflow system with comprehensive improvements to task management, context persistence, and specification traceability. The enhancement introduces six major components: (1) Replace tasks.md with Ticket CLI integration for proper task lifecycle management, (2) Add project memory pattern with context recitation for persistent awareness, (3) Implement master spec traceability to prevent coverage gaps, (4) Add deferred items tracking for postponed requirements, (5) Introduce @deferred-tracker agent for automated deferred item management, and (6) Make /plan-product an explicit Phase 0 of the workflow.

This enhancement requires modifications to 14 total agents: 1 new agent (@deferred-tracker), 10 major modifications to existing workflow agents, 2 minor modifications to support agents, and 1 deprecation (@tasks-creator).

The enhancement maintains the existing six-phase workflow while adding a formal Phase 0 and improving all subsequent phases. The system continues using markdown files and Git for persistence, but with better organization, traceability, and context awareness. Waves are dropped in favor of epics + dependencies, and tickets live in spec/FEAT-XXX/tickets/ folders with YAML frontmatter for structured metadata.

## Scope

### In Scope
- Context Recitation Pattern for all agents (current-focus.md, master-spec-coverage.md, deferred.md injection)
- @deferred-tracker agent for automated deferred item management
- /plan-product as explicit Phase 0 (creates .opencode/product/, .opencode/memory/, .opencode/standards/)
- Ticket CLI integration with tickets in spec/FEAT-XXX/tickets/
- Named master spec convention (master-spec.md or master-spec-{component}.md)
- Deferred item IDs derived from master spec sections (D-{section} format)
- current-focus.md updates at task/phase transitions only
- Epic completion verification by @integrator
- Ticket format with comprehensive YAML frontmatter
- Master spec traceability and coverage tracking
- Enhanced agent capabilities for new file structures

#### Agent Modifications Required
- **New Agents (1)**: @deferred-tracker
- **Major Modifications (10)**: @orchestrator, @shaper, @spec-writer, @coverage-auditor, @decomposer, @implementer, @integrator, @finalizer, @context-manager, @product-planner, @dependency-validator
- **Minor Modifications (2)**: @coordination-files
- **Deprecations (1)**: @tasks-creator

### Out of Scope
- Wave metadata (dropped in favor of epics + dependencies, may add as future enhancement)
- Central .tickets/ folder (tickets stay coupled to their specs)
- Granular current-focus.md updates on every agent call
- Backward compatibility with old tasks.md system
- Integration with external project management tools beyond Ticket CLI

## Agent Modifications

### New Agent (1)

| Agent | Type | Key Changes |
|-------|------|-------------|
| @deferred-tracker | NEW | Automated deferred item management with triggers after Phase 2, at epic start, and after Phase 6 |

### Major Modifications (10)

| Agent | Type | Key Changes |
|-------|------|-------------|
| @orchestrator | MODIFY | Add Phase 0 awareness, route @deferred-tracker invocation, work with tickets instead of tasks.md, context recitation |
| @shaper | MODIFY | Read master spec before shaping, include master spec sections in scope analysis, context recitation |
| @spec-writer | MODIFY | Master spec reference and traceability table, create/update master-spec-coverage.md, context recitation |
| @coverage-auditor | MODIFY | Check master spec coverage (not just spec.md), validate all claimed sections have tickets, context recitation |
| @decomposer | MODIFY | Create tickets via `tk create` instead of tasks.md, create epic tickets, set dependencies via `tk dep`, context recitation |
| @implementer | MODIFY | Use `tk start/close <id>` for task lifecycle, update current-focus.md at transitions, context recitation |
| @integrator | MODIFY | Epic completion verification (all tickets closed), check deferred items, update master-spec-coverage.md, context recitation |
| @finalizer | MODIFY | Update master-spec-coverage.md final status, verify deferred tracking, archive tickets, context recitation |
| @context-manager | MODIFY | Include memory files in context bundles (current-focus.md, master-spec-coverage.md, deferred.md) |
| @product-planner | MODIFY | Create .opencode/memory/ structure with empty templates (current-focus.md, deferred.md, master-spec-coverage.md) |
| @dependency-validator | MODIFY | Validate ticket dependencies instead of tasks.md, use `tk dep tree` for cycle detection, verify epic dependencies |

### Minor Modifications (2)

| Agent | Type | Key Changes |
|-------|------|-------------|
| @coordination-files | MODIFY | Create tickets/ folder in spec folders, support .opencode/memory/ structure, update templates |

### Deprecations (1)

| Agent | Type | Key Changes |
|-------|------|-------------|
| @tasks-creator | DEPRECATE | Functionality replaced by @decomposer creating tickets, mark deprecated |

### Context Recitation Recipients

The following agents receive context recitation (memory file injection at session start via @context-manager):
- @orchestrator, @shaper, @spec-writer, @coverage-auditor, @decomposer, @implementer, @integrator, @finalizer

## Research Findings

- Current workflow uses `.work/` folder structure with tasks.md for task breakdown
- Existing agents (@spec-writer, @coverage-auditor, @decomposer, @integrator) are well-defined with clear interfaces
- Ticket CLI is a bash script that stores tickets as markdown files with YAML frontmatter
- Ticket CLI supports dependencies, priority levels, status management, and epic grouping
- Current system lacks persistent memory between features and master spec traceability
- /plan-product command exists and creates `.opencode/product/` structure but is not formally part of workflow
- Templates exist in `.work/templates/` for various workflow files
- Current agents expect specific file formats (tasks.md, spec.md, acceptance.md)
- Manus/Lovable pattern of todo.md recitation provides inspiration for context awareness
- No existing deferred items tracking leads to lost requirements
- Agents currently lack context about overall project state and coverage gaps
- Current focus tracking is informal and inconsistent
- Wave concept adds complexity without clear benefit over epics + dependencies
- Master spec coverage is manual and error-prone without automated tracking
- Ticket CLI must be installed as prerequisite for workflow to function

## Options Considered

### Option A: Minimal Integration

**Description**: Keep current tasks.md system but add Ticket CLI as an optional enhancement. Add basic memory structure without major agent changes.

**Pros**:
- Low risk, minimal disruption to existing workflow
- Faster implementation timeline
- Backward compatibility maintained
- Agents don't need significant changes

**Cons**:
- Doesn't fully leverage Ticket CLI capabilities
- Limited improvement in task management
- Memory system would be basic and disconnected
- Misses opportunity for better traceability

### Option B: Full Integration with Ticket CLI

**Description**: Replace tasks.md entirely with Ticket CLI tickets stored in spec/FEAT-XXX/tickets/. Implement full memory pattern with master spec traceability. Enhance all relevant agents to work with new ticket system.

**Pros**:
- Leverages full power of Ticket CLI (dependencies, priorities, linking)
- Better task management with proper ticket lifecycle
- Comprehensive memory system for project context
- Master spec traceability prevents missed requirements
- Deferred items tracking improves spec quality
- Agents become more sophisticated and capable

**Cons**:
- Higher implementation complexity
- Requires changes to multiple agents
- More testing needed for integration
- Potential for integration issues

### Option C: Hybrid Approach

**Description**: Keep tasks.md for simple features but use Ticket CLI for complex features. Gradual migration path.

**Pros**:
- Provides migration path
- Reduces risk for simple features
- Allows testing on complex features first

**Cons**:
- Complexity of maintaining two systems
- Agents need to handle both formats
- Confusion about which system to use when
- Doesn't solve the core problems fully

## Selected Approach

**Selected**: Option B - Full Integration with Ticket CLI

**Rationale**: Option B provides the most comprehensive solution to the current limitations while leveraging the full capabilities of the Ticket CLI. The complexity is justified by the significant improvements in task management, context persistence, and specification traceability. The existing agent architecture is well-designed and can accommodate the changes without fundamental restructuring. The risk is manageable because we're enhancing rather than replacing the core workflow phases.

## Spec Depth Required

**Level**: L4

**Justification**: This is a complex system enhancement touching multiple agents, introducing new file structures, and changing core workflow patterns. L4 depth is required because:
- Multiple agent modifications need precise behavioral specifications
- New folder structures and file formats need detailed schemas
- Integration between Ticket CLI and existing workflow needs pseudocode-level detail
- Memory system patterns need explicit implementation guidance
- Traceability algorithms need detailed specification
- Error handling and edge cases are critical for workflow reliability

## Dependencies

### External Dependencies
- Ticket CLI (github.com/wedow/ticket) - must be installed and available as `tk` command (CRITICAL prerequisite)
- jq - required by Ticket CLI for query operations
- ripgrep (rg) - optional but recommended for Ticket CLI performance
- Git - required for persistence and versioning of all workflow files

### Internal Dependencies
- **Agent Files Requiring Modification**:
  - @orchestrator (major modification)
  - @shaper (major modification)
  - @spec-writer (major modification)
  - @coverage-auditor (major modification)
  - @decomposer (major modification)
  - @implementer (major modification)
  - @integrator (major modification)
  - @finalizer (major modification)
  - @context-manager (major modification)
  - @product-planner (major modification)
  - @dependency-validator (major modification)
  - @coordination-files (minor modification)
  - @tasks-creator (deprecation)
- **New Agent Files**:
  - @deferred-tracker (new creation)
- **Workflow Infrastructure**:
  - Current workflow templates in `.work/templates/` (may need updates)
  - /plan-product command for creating initial memory structure (becomes Phase 0)
  - Existing .opencode/ folder structure from project initialization
  - .opencode/product/ folder (created by /plan-product)
  - .opencode/memory/ folder structure (created by /plan-product)
  - .opencode/standards/ folder (created by /plan-product)
  - Master spec files in .opencode/ root (created by @spec-writer)
  - Context recitation pattern implementation in all agents

## Key Implementation Details

### Context Recitation Pattern
- **Purpose**: Prevent goal drift and maintain agent awareness of project state
- **Implementation**: All agents read memory files at session start before any other actions
- **Files Injected**: current-focus.md, master-spec-coverage.md, deferred.md
- **Location**: Add "Context Initialization" section to all agent prompts
- **Inspiration**: Based on Manus's todo.md recitation pattern from Lovable

### @deferred-tracker Agent
- **Purpose**: Automated management of deferred/out-of-scope items
- **Triggers**: After Phase 2 (spec creation), at epic start, after Phase 6 (completion)
- **Actions**: Scans specs for "out of scope" items, adds to deferred.md with metadata
- **Format**: target epic, master spec section reference, deferral reason
- **Alerts**: Notifies on overdue items based on target epic completion

### /plan-product as Phase 0
- **Status**: Explicit part of workflow (not optional)
- **Creates**: .opencode/product/ (mission.md, roadmap.md, tech-stack.md)
- **Creates**: .opencode/memory/ folder structure (empty templates)
- **Creates**: .opencode/standards/ with stack-specific skills
- **Does NOT Create**: master-spec-coverage.md (that's @spec-writer's responsibility)

### Ticket CLI Prerequisites
- **Installation**: Must be verified before workflow can run
- **Verification**: /setup command or documentation should check/warn if missing
- **Commands**: All ticket operations use `tk` command line interface

### Master Spec Naming Convention
- **Single Component**: master-spec.md
- **Multiple Components**: master-spec-ui.md, master-spec-api.md, etc.
- **Location**: .opencode/ root directory (not in spec folders)

### Deferred Item ID Format
- **Single Spec**: D-{section} (e.g., D-4.2 for section 4.2)
- **Multiple Specs**: D-{component}-{section} (e.g., D-ui-4.2, D-api-3.1)
- **Source**: Derived from master spec section numbers

### current-focus.md Update Triggers
- **Task Transitions**: tk start, tk close commands
- **Phase Transitions**: Between workflow phases
- **NOT Updated**: On every agent call (too granular)
- **Purpose**: Track current work without overwhelming detail

### Wave Removal
- **Status**: Dropped from implementation
- **Replacement**: Epics + dependencies provide better task grouping
- **Future Note**: "May add explicit wave metadata as optional enhancement if needed for human readability"

### Epic Completion Verification
- **Agent**: @integrator performs verification
- **Checks**: All tickets in epic are closed
- **Verifies**: Deferred items for current epic are properly tracked
- **Updates**: master-spec-coverage.md on epic completion

### Ticket File Organization
- **Location**: .opencode/spec/FEAT-XXX/tickets/ (NOT central .tickets/ folder)
- **Rationale**: Keeps tickets coupled to their specifications
- **Structure**: Each ticket as separate markdown file with YAML frontmatter

### Ticket YAML Frontmatter Schema
- **Required Fields**: id, status, type, priority, parent (epic), spec-section
- **Optional Fields**: deps, files-touched, acceptance-criteria
- **Traceability**: master-spec-ref field for linking to master spec sections
- **Format**: Comprehensive metadata for full lifecycle management

## Status

approved

## Approval

- **Approved**: 2026-01-06
- **Note**: Approach approved to proceed with Phase 2 (Specification)

---

<!-- Human gate: This document requires approval before proceeding to Phase 2 (Specification) -->