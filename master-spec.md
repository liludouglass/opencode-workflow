# OpenCode Workflow Master Specification

Version: 1.0
Last Updated: 2026-01-06

## Overview

This master specification defines all features and requirements for the OpenCode agentic workflow system.

---

## 1. Project Setup

### 1.1 Folder Structure
- `.opencode/` directory at project root
- `product/` subdirectory for mission, roadmap, tech-stack
- `spec/` subdirectory for feature specifications
- `memory/` subdirectory for persistent context

### 1.2 Initialization
- `/setup` command creates folder structure
- `/plan-product` creates product documentation
- Template files copied from config directory

---

## 2. Workflow Phases

### 2.1 Phase 0: Setup
- Work folder creation via @coordination-files
- Template copying and initialization

### 2.2 Phase 1: Shaping
- @shaper agent transforms vague input to clear direction
- Master spec check for relevant sections
- approach.md output with options and recommendations
- Human approval gate

### 2.3 Phase 2: Specification
- @spec-writer creates detailed spec from approach
- Master spec coverage table
- Deferred ticket creation for out-of-scope items
- Human approval gate

### 2.4 Phase 3: Decomposition
- @decomposer creates tickets (not tasks.md)
- Epic ticket for feature container
- Task tickets with dependencies
- Coverage audit verification

### 2.5 Phase 4: Implementation
- Ralph loops for task execution
- `tk start/close` for status updates
- Progress logging
- CI-green enforcement

### 2.6 Phase 5: Integration
- @deferred-tracker checks due items
- @integrator verifies all tickets closed
- Master spec coverage update
- Regression and compliance checks

### 2.7 Phase 6: Completion
- Summary generation
- Final review (optional)
- Archive preparation

---

## 3. Ticket System

### 3.1 Ticket Types
- `epic` - Feature container
- `task` - Individual work item
- `deferred` - Out-of-scope item for later

### 3.2 Ticket Fields
- id, status, type, priority
- deps (dependencies)
- parent (for task → epic relationship)
- spec-section, files-touched, acceptance-criteria

### 3.3 Ticket Commands
- `tk create` - Create tickets
- `tk start/close` - Status management
- `tk dep` - Dependency management
- `tk ready/blocked` - Query actionable tasks
- `tk query` - JQ-based filtering

---

## 4. Memory System

### 4.1 Master Spec Coverage
- Tracks which spec sections are implemented
- Status: DONE, DEFERRED, PARTIAL, MISSING
- Auto-updated by agents

### 4.2 Current Focus
- Auto-generated at session start
- Shows ready tasks, blocked tasks, deferred items
- Supports agent context recitation

### 4.3 Project Context
- Summary from mission and tech stack
- Active work tracking
- Key constraints

### 4.4 Decisions Log
- Architecture decision records
- Context, decision, consequences

---

## 5. Agent System

### 5.1 Core Agents
- @orchestrator - Workflow coordination
- @shaper - Phase 1 shaping
- @spec-writer - Phase 2 specification
- @decomposer - Phase 3 decomposition
- @implementer - Phase 4 implementation
- @integrator - Phase 5 integration
- @finalizer - Phase 6 completion

### 5.2 Verification Agents
- @coverage-auditor - Spec coverage verification
- @deferred-tracker - Deferred item management
- @spec-compliance - Implementation compliance
- @regression-detector - Regression testing

### 5.3 Context Management
- @context-manager - Context bundle generation
- Fresh context per task iteration
- Token budget management

---

## 6. Human Gates

### 6.1 Required Gates
- Phase 1: Approve approach.md
- Phase 2: Approve spec.md

### 6.2 Optional Gates
- Phase 6: Final review (if manual_review flag set)

---

## 7. Error Handling

### 7.1 Task Failures
- Retry with fresh context
- Max iterations before escalation
- Error logging to progress.md

### 7.2 Integration Failures
- Bug ticket creation
- Loop back to Phase 4
- Root cause documentation

---

## 8. Future Enhancements

### 8.1 GitHub Integration
- Issue sync (bi-directional)
- PR creation automation
- Label management

### 8.2 Analytics
- Task completion metrics
- Coverage trends
- Agent performance tracking

### 8.3 Multi-Project Support
- Cross-project dependencies
- Shared specifications
- Unified roadmap view