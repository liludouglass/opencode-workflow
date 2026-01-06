#!/bin/bash
# uninstall.sh - Remove OpenCode workflow customization symlinks
#
# This script removes symlinks created by install.sh
# It only removes symlinks that point to this repository, preserving other files.

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_DIR="$HOME/.config/opencode"

echo "Uninstalling OpenCode workflow customizations..."
echo "  Repository: $REPO_DIR"
echo "  Config: $CONFIG_DIR"
echo ""

# Function to remove symlinks that point to our repo
remove_repo_symlinks() {
    local dest_dir="$1"
    
    if [ -d "$dest_dir" ]; then
        for item in "$dest_dir"/*; do
            if [ -L "$item" ]; then
                local target=$(readlink "$item")
                # Check if symlink points to our repo
                if [[ "$target" == "$REPO_DIR"* ]]; then
                    rm "$item"
                    echo "  Removed: $(basename "$item")"
                fi
            fi
        done
    fi
}

echo "Removing agent symlinks..."
remove_repo_symlinks "$CONFIG_DIR/agent"

echo ""
echo "Removing command symlinks..."
remove_repo_symlinks "$CONFIG_DIR/command"

echo ""
echo "Removing plugin symlinks..."
remove_repo_symlinks "$CONFIG_DIR/plugin"

echo ""
echo "Removing skill symlinks..."
remove_repo_symlinks "$CONFIG_DIR/skill"

echo ""
echo "Removing tool symlinks..."
remove_repo_symlinks "$CONFIG_DIR/tool"

echo ""
echo "Removing .work symlinks..."
if [ -L "$CONFIG_DIR/.work/config.yaml" ]; then
    target=$(readlink "$CONFIG_DIR/.work/config.yaml")
    if [[ "$target" == "$REPO_DIR"* ]]; then
        rm "$CONFIG_DIR/.work/config.yaml"
        echo "  Removed: config.yaml"
    fi
fi
if [ -L "$CONFIG_DIR/.work/templates" ]; then
    target=$(readlink "$CONFIG_DIR/.work/templates")
    if [[ "$target" == "$REPO_DIR"* ]]; then
        rm "$CONFIG_DIR/.work/templates"
        echo "  Removed: templates/"
    fi
fi

echo ""
echo "✅ Uninstallation complete!"
echo ""
echo "Note: OpenCode's built-in files were preserved."
echo "      Restart OpenCode for changes to take effect."
