#!/bin/bash
# install.sh - Install OpenCode workflow customizations via symlinks
#
# This script creates symlinks from this repository to ~/.config/opencode/
# Symlinks allow edits in the repo to immediately reflect in OpenCode.

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_DIR="$HOME/.config/opencode"

echo "Installing OpenCode workflow customizations..."
echo "  Source: $REPO_DIR"
echo "  Target: $CONFIG_DIR"
echo ""

# Ensure config directory exists
mkdir -p "$CONFIG_DIR"/{agent,command,plugin,skill,tool}

# Function to create symlinks for files in a directory
link_files() {
    local src_dir="$1"
    local dest_dir="$2"
    
    if [ -d "$src_dir" ] && [ "$(ls -A "$src_dir" 2>/dev/null)" ]; then
        for file in "$src_dir"/*; do
            if [ -e "$file" ]; then
                local basename=$(basename "$file")
                local dest="$dest_dir/$basename"
                
                # Remove existing file/symlink if it exists
                if [ -e "$dest" ] || [ -L "$dest" ]; then
                    rm -rf "$dest"
                fi
                
                # Create symlink
                ln -sf "$file" "$dest"
                echo "  Linked: $basename"
            fi
        done
    fi
}

# Function to create symlinks for directories (plugins, skills)
link_dirs() {
    local src_dir="$1"
    local dest_dir="$2"
    
    if [ -d "$src_dir" ]; then
        for dir in "$src_dir"/*/; do
            if [ -d "$dir" ]; then
                local basename=$(basename "$dir")
                local dest="$dest_dir/$basename"
                
                # Remove existing directory/symlink if it exists
                if [ -e "$dest" ] || [ -L "$dest" ]; then
                    rm -rf "$dest"
                fi
                
                # Create symlink to directory
                ln -sf "${dir%/}" "$dest"
                echo "  Linked: $basename/"
            fi
        done
    fi
}

echo "Linking agents..."
link_files "$REPO_DIR/agent" "$CONFIG_DIR/agent"

echo ""
echo "Linking commands..."
link_files "$REPO_DIR/command" "$CONFIG_DIR/command"

echo ""
echo "Linking plugins..."
link_dirs "$REPO_DIR/plugin" "$CONFIG_DIR/plugin"

echo ""
echo "Linking skills..."
link_dirs "$REPO_DIR/skill" "$CONFIG_DIR/skill"

echo ""
echo "Linking tools..."
link_files "$REPO_DIR/tool" "$CONFIG_DIR/tool"

# Link templates/.work to .work if it doesn't exist as a regular directory
if [ -d "$REPO_DIR/templates/.work" ]; then
    echo ""
    echo "Linking .work templates..."
    
    # Create .work directory if it doesn't exist
    mkdir -p "$CONFIG_DIR/.work"
    
    # Link config.yaml if it exists
    if [ -f "$REPO_DIR/templates/.work/config.yaml" ]; then
        ln -sf "$REPO_DIR/templates/.work/config.yaml" "$CONFIG_DIR/.work/config.yaml"
        echo "  Linked: config.yaml"
    fi
    
    # Link templates directory
    if [ -d "$REPO_DIR/templates/.work/templates" ]; then
        if [ -e "$CONFIG_DIR/.work/templates" ] || [ -L "$CONFIG_DIR/.work/templates" ]; then
            rm -rf "$CONFIG_DIR/.work/templates"
        fi
        ln -sf "$REPO_DIR/templates/.work/templates" "$CONFIG_DIR/.work/templates"
        echo "  Linked: templates/"
    fi
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Note: Restart OpenCode for changes to take effect."
echo "      If plugins have dependencies, run 'bun install' in the plugin directories."
