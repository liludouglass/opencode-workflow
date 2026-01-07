---
description: "Initialize project with product context, template scaffolding, and stack-specific skills"
---

# Plan Product

Create foundational product documentation and scaffold your project from production-ready templates. This command should be run **once** at the start of a new project.

## What It Creates

- **Mission**: Vision, goals, success criteria
- **Roadmap**: Phased development plan  
- **Tech Stack**: Technology choices and rationale
- **Project Scaffold**: From curated production-ready templates
- **Stack Skills**: Framework-specific coding standards
- **Memory Structure**: Project context and coverage tracking files

## Usage

```
/plan-product
/plan-product [project description]
/plan-product I want to build a fitness tracking app with social features
```

## Workflow

1. **Analyze Requirements**
   - Understands your project idea
   - Identifies platform needs (web, mobile, desktop, API)
   - Determines scale and complexity

2. **Recommend Stack & Template**
   - Suggests appropriate template from registry
   - Shows alternatives for comparison
   - Asks for confirmation before proceeding

3. **Scaffold Project**
   - Uses CLI if available (e.g., `npx create-t3-app`)
   - Uses Copier for templates without CLI
   - Falls back to git clone if needed

4. **Configure OpenCode**
   - Creates `.opencode/product/` with mission, roadmap, tech-stack
   - Creates `.opencode/memory/` structure:
     - `project.md` - Project context summary
     - `master-spec-coverage.md` - Initialized empty
     - `decisions.md` - Architecture decisions
   - Loads relevant skills to `.opencode/standards/`

5. **Master Spec Creation (Optional)**
   - If user has requirements document, offer to create `master-spec.md`
   - If multiple domains (UI, API), create `master-spec-ui.md`, `master-spec-api.md`
   - Initialize master-spec-coverage.md with section list

6. **Ready to Build**
   - Project is scaffolded and configured
   - Stack-specific patterns loaded
   - Full spec-driven workflow available

## Available Templates

### Web
- **T3 Stack**: Next.js + tRPC + Tailwind + Prisma (`npx create-t3-app`)
- **T3 Turbo**: T3 + Turborepo monorepo
- **FastAPI Full Stack**: Python + React + PostgreSQL
- **BoxyHQ SaaS**: Enterprise B2B with SSO/RBAC
- **Django**: Python web apps with Cookiecutter

### Mobile
- **Ignite**: React Native + Expo (battle-tested, 9 years)
- **Obytes**: Modern Expo + NativeWind + Zustand

### Desktop
- **Electron React**: Cross-platform desktop apps

### Backend
- **FastAPI**: Python API services
- **Django REST**: Python APIs with DRF

## When to Use

- Starting a new project from scratch
- Want production-ready scaffolding
- Need stack-specific coding standards
- Setting up team conventions

## Template

@product-planner

**Task**: Create product documentation and scaffold project from appropriate template.

**User Request**:
$ARGUMENTS

**Instructions**:
1. Analyze the user's project idea and requirements
2. Check existing project files (README.md, package.json, etc.)
3. Recommend appropriate template from ~/.config/opencode/templates/registry.json
4. Present recommendation with alternatives, ask for confirmation
5. Upon confirmation:
   - Scaffold from selected template (CLI/Copier/Clone)
   - Create `.opencode/product/` with mission.md, roadmap.md, tech-stack.md
   - Create `.opencode/memory/` structure with project.md, master-spec-coverage.md, decisions.md
   - Copy relevant skills to `.opencode/standards/`
6. Provide summary of what was created and next steps

**Success Criteria**:
- User confirmed template selection
- Project scaffolded from template
- `.opencode/product/` exists with all three documents
- `.opencode/standards/` has stack-specific skills
- User knows next steps to start building
