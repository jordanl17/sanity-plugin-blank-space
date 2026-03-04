#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx)
    cd "$CLAUDE_PROJECT_DIR" || exit 0
    npx eslint --fix "$FILE_PATH" 2>&1
    npx prettier --write "$FILE_PATH" 2>&1
    ;;
  *.json|*.md|*.yml|*.yaml)
    cd "$CLAUDE_PROJECT_DIR" || exit 0
    npx prettier --write "$FILE_PATH" 2>&1
    ;;
esac

exit 0
