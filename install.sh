#!/usr/bin/env zsh
# install.sh - Modular installer for OpenCode workflow customizations
#
# REQUIRES: zsh (macOS default shell, avoids bash 3.2 compatibility issues)
#
# Creates symlinks from this repository to ~/.config/opencode/
# Supports selective installation with --only flag
# Merges instead of replacing - respects existing user files

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_DIR="$HOME/.config/opencode"
BACKUP_DIR="$CONFIG_DIR/.backup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Counters
INSTALLED=0
SKIPPED=0
CONFLICTS=0
BACKED_UP=0

# Flags
DRY_RUN=false
FORCE=false
BACKUP=false
LIST_ONLY=false
SELECTED_COMPONENTS=()

# ============================================================================
# COMPONENT REGISTRY
# ============================================================================

# Agents (files in agent/)
typeset -A AGENTS=(
    ["orchestrator"]="agent/orchestrator.md"
    ["coordination-files"]="agent/coordination-files.md"
    ["implementer"]="agent/implementer.md"
    ["shaper"]="agent/shaper.md"
    ["spec-writer"]="agent/spec-writer.md"
    ["spec-shaper"]="agent/spec-shaper.md"
    ["spec-auditor"]="agent/spec-auditor.md"
    ["spec-compliance"]="agent/spec-compliance.md"
    ["decomposer"]="agent/decomposer.md"
    ["tasks-creator"]="agent/tasks-creator.md"
    ["integrator"]="agent/integrator.md"
    ["finalizer"]="agent/finalizer.md"
    ["verifier"]="agent/verifier.md"
    ["debugger"]="agent/debugger.md"
    ["bug-analyzer"]="agent/bug-analyzer.md"
    ["fix-planner"]="agent/fix-planner.md"
    ["code-reviewer"]="agent/code-reviewer.md"
    ["coverage-auditor"]="agent/coverage-auditor.md"
    ["context-manager"]="agent/context-manager.md"
    ["alignment-checker"]="agent/alignment-checker.md"
    ["dependency-validator"]="agent/dependency-validator.md"
    ["feasibility-checker"]="agent/feasibility-checker.md"
    ["quality-gate"]="agent/quality-gate.md"
    ["regression-detector"]="agent/regression-detector.md"
    ["security-auditor"]="agent/security-auditor.md"
    ["synthesis"]="agent/synthesis.md"
    ["analysis"]="agent/analysis.md"
    ["research"]="agent/research.md"
    ["youtube"]="agent/youtube.md"
    ["local-chat"]="agent/local-chat.md"
    ["product-planner"]="agent/product-planner.md"
    ["build-v2"]="agent/build-v2.md"
    ["build-v3"]="agent/build-v3.md"
    ["orchestrator-deprecated"]="agent/orchestrator.deprecated.md"
)

# Commands (files in command/)
typeset -A COMMANDS=(
    ["feature"]="command/feature.md"
    ["bug"]="command/bug.md"
    ["ralph"]="command/ralph.md"
    ["setup"]="command/setup.md"
    ["status"]="command/status.md"
    ["skill"]="command/skill.md"
    ["ctx"]="command/ctx.md"
    ["debug"]="command/debug.md"
    ["improve"]="command/improve.md"
    ["build"]="command/build.md"
    ["convoy"]="command/convoy.md"
    ["plan-product"]="command/plan-product.md"
    ["research"]="command/research.md"
    ["scratch"]="command/scratch.md"
    ["ask"]="command/ask.md"
    ["tweet"]="command/tweet.md"
    ["tweetlong"]="command/tweetlong.md"
    ["warmup"]="command/warmup.md"
    ["yt"]="command/yt.md"
)

# Plugins (directories in plugin/)
typeset -A PLUGINS=(
    ["visual-feedback"]="plugin/visual-feedback"
    ["ralph-wiggum"]="plugin/ralph-wiggum"
    ["context-manager"]="plugin/context-manager"
)

# Skills (directories and files in skill/)
typeset -A SKILLS=(
    ["wf-orchestrate"]="skill/wf-orchestrate"
    ["wf-shaping"]="skill/wf-shaping"
    ["wf-write-spec"]="skill/wf-write-spec"
    ["wf-research-spec"]="skill/wf-research-spec"
    ["wf-initialize-spec"]="skill/wf-initialize-spec"
    ["wf-create-tasks"]="skill/wf-create-tasks"
    ["wf-implement-tasks"]="skill/wf-implement-tasks"
    ["wf-integration"]="skill/wf-integration"
    ["wf-completion"]="skill/wf-completion"
    ["wf-bug-analyze"]="skill/wf-bug-analyze"
    ["wf-fix-plan"]="skill/wf-fix-plan"
    ["std-api"]="skill/std-api"
    ["std-coding-style"]="skill/std-coding-style"
    ["std-conventions"]="skill/std-conventions"
    ["std-error-handling"]="skill/std-error-handling"
    ["std-production-code"]="skill/std-production-code"
    ["std-risk-classification"]="skill/std-risk-classification"
    ["std-test-writing"]="skill/std-test-writing"
    ["typescript"]="skill/typescript.md"
    ["fastapi"]="skill/fastapi.md"
    ["nextjs"]="skill/nextjs.md"
    ["react-native"]="skill/react-native.md"
    ["supabase"]="skill/supabase.md"
    ["tailwind"]="skill/tailwind.md"
)

# Tools (files in tool/)
typeset -A TOOLS=(
    ["count_tokens"]="tool/count_tokens.py"
    ["google_search"]="tool/google_search.py"
    ["save_research"]="tool/save_research.py"
    ["save_yt_query"]="tool/save_yt_query.py"
    ["warmup_ollama"]="tool/warmup_ollama.py"
    ["yt_transcript"]="tool/yt_transcript.py"
    ["ollama"]="tool/ollama.ts"
    ["research"]="tool/research.ts"
    ["youtube"]="tool/youtube.ts"
)

# Templates (special handling)
TEMPLATES_WORK="templates/.work"

# ============================================================================
# BUNDLE DEFINITIONS
# ============================================================================

# Bundle: core - minimal workflow setup
BUNDLE_CORE=(
    "agent:orchestrator"
    "agent:coordination-files"
    "agent:shaper"
    "agent:spec-shaper"
    "command:feature"
    "command:setup"
    "command:status"
)

# Bundle: full-workflow - everything
BUNDLE_FULL_WORKFLOW=(
    "agent:*"
    "command:*"
    "skill:*"
    "tool:*"
    "plugin:*"
    "templates"
)

# Bundle: plugins-only - just plugins
BUNDLE_PLUGINS_ONLY=(
    "plugin:*"
)

# Bundle: ralph - ralph-wiggum execution pattern
BUNDLE_RALPH=(
    "plugin:ralph-wiggum"
    "agent:implementer"
    "command:ralph"
)

# Bundle: research - research workflow
BUNDLE_RESEARCH=(
    "agent:research"
    "agent:youtube"
    "command:research"
    "command:yt"
    "tool:google_search"
    "tool:save_research"
    "tool:save_yt_query"
    "tool:yt_transcript"
    "tool:research"
    "tool:youtube"
)

# Bundle: agents-only - all agents
BUNDLE_AGENTS_ONLY=(
    "agent:*"
)

# Bundle: commands-only - all commands
BUNDLE_COMMANDS_ONLY=(
    "command:*"
)

# Bundle: skills-only - all skills
BUNDLE_SKILLS_ONLY=(
    "skill:*"
)

# Bundle: tools-only - all tools
BUNDLE_TOOLS_ONLY=(
    "tool:*"
)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_usage() {
    echo "Usage: ./install.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --only <components>   Install only specified components (comma-separated)"
    echo "  --list                List all available components and bundles"
    echo "  --dry-run             Preview changes without installing"
    echo "  --backup              Backup existing files before replacing"
    echo "  --force               Overwrite conflicts without prompting"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Component naming:"
    echo "  agent:<name>          Single agent (e.g., agent:orchestrator)"
    echo "  command:<name>        Single command (e.g., command:feature)"
    echo "  plugin:<name>         Single plugin (e.g., plugin:ralph-wiggum)"
    echo "  skill:<name>          Single skill (e.g., skill:wf-orchestrate)"
    echo "  tool:<name>           Single tool (e.g., tool:count_tokens)"
    echo "  bundle:<name>         Predefined bundle (e.g., bundle:core)"
    echo "  templates             Workflow templates (.work)"
    echo ""
    echo "Examples:"
    echo "  ./install.sh                                    # Install everything"
    echo "  ./install.sh --only bundle:core                 # Install core workflow"
    echo "  ./install.sh --only agent:implementer,command:ralph"
    echo "  ./install.sh --only bundle:full-workflow --dry-run"
    echo "  ./install.sh --only plugin:ralph-wiggum --backup"
}

list_components() {
    echo -e "${CYAN}Available Components${NC}"
    echo "===================="
    echo ""
    
    echo -e "${GREEN}Bundles:${NC}"
    echo "  bundle:core              Orchestrator, shaper, feature command"
    echo "  bundle:full-workflow     All components (agents, commands, skills, plugins, tools, templates)"
    echo "  bundle:plugins-only      All plugins"
    echo "  bundle:ralph             Ralph-Wiggum execution pattern (plugin + implementer + ralph command)"
    echo "  bundle:research          Research workflow (research agent, youtube, tools)"
    echo "  bundle:agents-only       All agents"
    echo "  bundle:commands-only     All commands"
    echo "  bundle:skills-only       All skills"
    echo "  bundle:tools-only        All tools"
    echo ""
    
    echo -e "${GREEN}Agents:${NC}"
    for name in "${(@k)AGENTS}"; do
        if [ -f "$REPO_DIR/${AGENTS[$name]}" ]; then
            echo "  agent:$name"
        fi
    done | sort
    echo ""
    
    echo -e "${GREEN}Commands:${NC}"
    for name in "${(@k)COMMANDS}"; do
        if [ -f "$REPO_DIR/${COMMANDS[$name]}" ]; then
            echo "  command:$name"
        fi
    done | sort
    echo ""
    
    echo -e "${GREEN}Plugins:${NC}"
    for name in "${(@k)PLUGINS}"; do
        if [ -d "$REPO_DIR/${PLUGINS[$name]}" ]; then
            echo "  plugin:$name"
        fi
    done | sort
    echo ""
    
    echo -e "${GREEN}Skills:${NC}"
    for name in "${(@k)SKILLS}"; do
        local skill_path="${SKILLS[$name]}"
        if [ -e "$REPO_DIR/$skill_path" ]; then
            echo "  skill:$name"
        fi
    done | sort
    echo ""
    
    echo -e "${GREEN}Tools:${NC}"
    for name in "${(@k)TOOLS}"; do
        if [ -f "$REPO_DIR/${TOOLS[$name]}" ]; then
            echo "  tool:$name"
        fi
    done | sort
    echo ""
    
    echo -e "${GREEN}Other:${NC}"
    echo "  templates                Workflow templates (.work directory)"
}

# Check if a path is a symlink pointing to our repo
is_our_symlink() {
    local target="$1"
    if [ -L "$target" ]; then
        local link_target=$(readlink "$target")
        # Check if it points to our repo (absolute or relative)
        if [[ "$link_target" == "$REPO_DIR"* ]] || [[ "$link_target" == *"opencode-workflow"* ]]; then
            return 0
        fi
    fi
    return 1
}

# Backup a file or directory
backup_file() {
    local file="$1"
    if [ -e "$file" ] || [ -L "$file" ]; then
        local timestamp=$(date +%Y%m%d_%H%M%S)
        local basename=$(basename "$file")
        local backup_path="$BACKUP_DIR/${basename}_${timestamp}"
        
        mkdir -p "$BACKUP_DIR"
        
        if $DRY_RUN; then
            echo -e "  ${BLUE}[BACKUP]${NC} Would backup: $file -> $backup_path"
        else
            cp -a "$file" "$backup_path"
            echo -e "  ${BLUE}[BACKUP]${NC} $file -> $backup_path"
        fi
        ((BACKED_UP++))
    fi
}

# Install a single file as symlink
install_file() {
    local src="$1"
    local dest="$2"
    local display_name="$3"
    
    if [ ! -e "$src" ]; then
        return
    fi
    
    local dest_dir=$(dirname "$dest")
    
    # Check current state
    if [ -e "$dest" ] || [ -L "$dest" ]; then
        if is_our_symlink "$dest"; then
            # Already linked to our repo - skip
            echo -e "  ${YELLOW}[SKIP]${NC} $display_name (already linked to this repo)"
            ((SKIPPED++))
            return
        else
            # Conflict - file exists and isn't our symlink
            if $FORCE; then
                if $BACKUP; then
                    backup_file "$dest"
                fi
                if $DRY_RUN; then
                    echo -e "  ${GREEN}[INSTALL]${NC} $display_name (would replace with --force)"
                else
                    rm -rf "$dest"
                    ln -sf "$src" "$dest"
                    echo -e "  ${GREEN}[INSTALL]${NC} $display_name (replaced with --force)"
                fi
                ((INSTALLED++))
            else
                echo -e "  ${RED}[CONFLICT]${NC} $display_name exists (use --force to replace, --backup to save first)"
                ((CONFLICTS++))
            fi
            return
        fi
    fi
    
    # No conflict - install
    if $DRY_RUN; then
        echo -e "  ${GREEN}[INSTALL]${NC} $display_name -> $dest"
    else
        mkdir -p "$dest_dir"
        ln -sf "$src" "$dest"
        echo -e "  ${GREEN}[INSTALL]${NC} $display_name -> $dest"
    fi
    ((INSTALLED++))
}

# Install a directory as symlink
install_dir() {
    local src="$1"
    local dest="$2"
    local display_name="$3"
    
    if [ ! -d "$src" ]; then
        return
    fi
    
    local dest_dir=$(dirname "$dest")
    
    # Check current state
    if [ -e "$dest" ] || [ -L "$dest" ]; then
        if is_our_symlink "$dest"; then
            echo -e "  ${YELLOW}[SKIP]${NC} $display_name/ (already linked to this repo)"
            ((SKIPPED++))
            return
        else
            if $FORCE; then
                if $BACKUP; then
                    backup_file "$dest"
                fi
                if $DRY_RUN; then
                    echo -e "  ${GREEN}[INSTALL]${NC} $display_name/ (would replace with --force)"
                else
                    rm -rf "$dest"
                    ln -sf "$src" "$dest"
                    echo -e "  ${GREEN}[INSTALL]${NC} $display_name/ (replaced with --force)"
                fi
                ((INSTALLED++))
            else
                echo -e "  ${RED}[CONFLICT]${NC} $display_name/ exists (use --force to replace, --backup to save first)"
                ((CONFLICTS++))
            fi
            return
        fi
    fi
    
    if $DRY_RUN; then
        echo -e "  ${GREEN}[INSTALL]${NC} $display_name/ -> $dest"
    else
        mkdir -p "$dest_dir"
        ln -sf "$src" "$dest"
        echo -e "  ${GREEN}[INSTALL]${NC} $display_name/ -> $dest"
    fi
    ((INSTALLED++))
}

# ============================================================================
# COMPONENT INSTALLERS
# ============================================================================

install_agent() {
    local name="$1"
    if [ -n "${AGENTS[$name]}" ]; then
        local src="$REPO_DIR/${AGENTS[$name]}"
        local dest="$CONFIG_DIR/${AGENTS[$name]}"
        install_file "$src" "$dest" "agent:$name"
    fi
}

install_all_agents() {
    for name in "${(@k)AGENTS}"; do
        install_agent "$name"
    done
}

install_command() {
    local name="$1"
    if [ -n "${COMMANDS[$name]}" ]; then
        local src="$REPO_DIR/${COMMANDS[$name]}"
        local dest="$CONFIG_DIR/${COMMANDS[$name]}"
        install_file "$src" "$dest" "command:$name"
    fi
}

install_all_commands() {
    for name in "${(@k)COMMANDS}"; do
        install_command "$name"
    done
}

install_plugin() {
    local name="$1"
    if [ -n "${PLUGINS[$name]}" ]; then
        local src="$REPO_DIR/${PLUGINS[$name]}"
        local dest="$CONFIG_DIR/${PLUGINS[$name]}"
        install_dir "$src" "$dest" "plugin:$name"
    fi
}

install_all_plugins() {
    for name in "${(@k)PLUGINS}"; do
        install_plugin "$name"
    done
}

install_skill() {
    local name="$1"
    if [ -n "${SKILLS[$name]}" ]; then
        local skill_path="${SKILLS[$name]}"
        local src="$REPO_DIR/$skill_path"
        local dest="$CONFIG_DIR/$skill_path"
        
        if [ -d "$src" ]; then
            install_dir "$src" "$dest" "skill:$name"
        elif [ -f "$src" ]; then
            install_file "$src" "$dest" "skill:$name"
        fi
    fi
}

install_all_skills() {
    for name in "${(@k)SKILLS}"; do
        install_skill "$name"
    done
}

install_tool() {
    local name="$1"
    if [ -n "${TOOLS[$name]}" ]; then
        local src="$REPO_DIR/${TOOLS[$name]}"
        local dest="$CONFIG_DIR/${TOOLS[$name]}"
        install_file "$src" "$dest" "tool:$name"
    fi
}

install_all_tools() {
    for name in "${(@k)TOOLS}"; do
        install_tool "$name"
    done
}

install_templates() {
    if [ -d "$REPO_DIR/$TEMPLATES_WORK" ]; then
        echo ""
        echo "Installing templates..."
        
        # Create .work directory
        if ! $DRY_RUN; then
            mkdir -p "$CONFIG_DIR/.work"
        fi
        
        # Link config.yaml
        if [ -f "$REPO_DIR/$TEMPLATES_WORK/config.yaml" ]; then
            install_file "$REPO_DIR/$TEMPLATES_WORK/config.yaml" "$CONFIG_DIR/.work/config.yaml" "templates:config.yaml"
        fi
        
        # Link templates directory
        if [ -d "$REPO_DIR/$TEMPLATES_WORK/templates" ]; then
            install_dir "$REPO_DIR/$TEMPLATES_WORK/templates" "$CONFIG_DIR/.work/templates" "templates:templates"
        fi
    fi
}

# ============================================================================
# BUNDLE EXPANSION
# ============================================================================

expand_bundle() {
    local bundle_name="$1"
    local -a components
    
    case "$bundle_name" in
        core)
            components=("${BUNDLE_CORE[@]}")
            ;;
        full-workflow)
            components=("${BUNDLE_FULL_WORKFLOW[@]}")
            ;;
        plugins-only)
            components=("${BUNDLE_PLUGINS_ONLY[@]}")
            ;;
        ralph)
            components=("${BUNDLE_RALPH[@]}")
            ;;
        research)
            components=("${BUNDLE_RESEARCH[@]}")
            ;;
        agents-only)
            components=("${BUNDLE_AGENTS_ONLY[@]}")
            ;;
        commands-only)
            components=("${BUNDLE_COMMANDS_ONLY[@]}")
            ;;
        skills-only)
            components=("${BUNDLE_SKILLS_ONLY[@]}")
            ;;
        tools-only)
            components=("${BUNDLE_TOOLS_ONLY[@]}")
            ;;
        *)
            echo "Unknown bundle: $bundle_name"
            exit 1
            ;;
    esac
    
    for component in "${components[@]}"; do
        echo "$component"
    done
}

# ============================================================================
# MAIN INSTALLATION LOGIC
# ============================================================================

install_component() {
    local component="$1"
    local type="${component%%:*}"
    local name="${component#*:}"
    
    case "$type" in
        agent)
            if [ "$name" = "*" ]; then
                install_all_agents
            else
                install_agent "$name"
            fi
            ;;
        command)
            if [ "$name" = "*" ]; then
                install_all_commands
            else
                install_command "$name"
            fi
            ;;
        plugin)
            if [ "$name" = "*" ]; then
                install_all_plugins
            else
                install_plugin "$name"
            fi
            ;;
        skill)
            if [ "$name" = "*" ]; then
                install_all_skills
            else
                install_skill "$name"
            fi
            ;;
        tool)
            if [ "$name" = "*" ]; then
                install_all_tools
            else
                install_tool "$name"
            fi
            ;;
        bundle)
            local expanded=$(expand_bundle "$name")
            while IFS= read -r sub_component; do
                install_component "$sub_component"
            done <<< "$expanded"
            ;;
        templates)
            install_templates
            ;;
        *)
            echo "Unknown component type: $type"
            ;;
    esac
}

install_everything() {
    echo "Installing agents..."
    install_all_agents
    
    echo ""
    echo "Installing commands..."
    install_all_commands
    
    echo ""
    echo "Installing plugins..."
    install_all_plugins
    
    echo ""
    echo "Installing skills..."
    install_all_skills
    
    echo ""
    echo "Installing tools..."
    install_all_tools
    
    install_templates
}

# ============================================================================
# ARGUMENT PARSING
# ============================================================================

while [[ $# -gt 0 ]]; do
    case $1 in
        --only)
            IFS=',' read -rA SELECTED_COMPONENTS <<< "$2"
            shift 2
            ;;
        --list)
            LIST_ONLY=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --backup)
            BACKUP=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
done

# ============================================================================
# EXECUTION
# ============================================================================

if $LIST_ONLY; then
    list_components
    exit 0
fi

echo -e "${CYAN}Installing OpenCode Workflow Components...${NC}"
echo ""
echo "  Source: $REPO_DIR"
echo "  Target: $CONFIG_DIR"

if $DRY_RUN; then
    echo -e "  ${YELLOW}Mode: DRY RUN (no changes will be made)${NC}"
fi

if $BACKUP; then
    echo -e "  ${BLUE}Backup: enabled${NC}"
fi

if $FORCE; then
    echo -e "  ${RED}Force: enabled (will overwrite conflicts)${NC}"
fi

echo ""

# Ensure base directories exist
if ! $DRY_RUN; then
    mkdir -p "$CONFIG_DIR"/{agent,command,plugin,skill,tool}
fi

if [ ${#SELECTED_COMPONENTS[@]} -gt 0 ]; then
    echo -e "Selected: ${SELECTED_COMPONENTS[*]}"
    echo ""
    
    for component in "${SELECTED_COMPONENTS[@]}"; do
        # Trim whitespace
        component=$(echo "$component" | xargs)
        install_component "$component"
    done
else
    install_everything
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Installed: ${GREEN}$INSTALLED${NC} | Skipped: ${YELLOW}$SKIPPED${NC} | Conflicts: ${RED}$CONFLICTS${NC}"

if [ $BACKED_UP -gt 0 ]; then
    echo -e "Backed up: ${BLUE}$BACKED_UP${NC} files to $BACKUP_DIR"
fi

if [ $CONFLICTS -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}Tip:${NC} Use --force to replace conflicts, --backup to save existing files first"
fi

if ! $DRY_RUN && [ $INSTALLED -gt 0 ]; then
    echo ""
    echo "Restart OpenCode for changes to take effect."
    if [ ${#PLUGINS[@]} -gt 0 ]; then
        echo "If plugins have dependencies, run 'bun install' in the plugin directories."
    fi
fi
