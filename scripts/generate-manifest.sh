#!/bin/bash
# Universal Fork Divergence Manifest Generator
# Usage: cd <fork-repo> && ./scripts/generate-manifest.sh [branch] [upstream]
#
# Compares two branches (default: rezus/main vs upstream/main) and produces
# a complete divergence manifest in YAML. The manifest is the single source
# of truth for sync workflow automation.
#
# Three categories:
#   deletions  → dirs in upstream not in ours (always deleted after merge)
#   patches    → files in both, different content (verified by grep signature)
#   additive   → files only in ours (never conflict, carried by merge)
#
# Run after every upstream merge:
#   ./scripts/generate-manifest.sh > rezus-manifest.yaml
set -uo pipefail

BRANCH="${1:-rezus/main}"
UPSTREAM="${2:-upstream/main}"
WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

# === HEADER ===
cat << HEADER
# Fork Divergence Manifest
# Generated: $(date -u +%Y-%m-%d)
# Source: git diff $BRANCH $UPSTREAM
#
# REGENERATE: ./scripts/generate-manifest.sh > rezus-manifest.yaml

HEADER

# === DELETIONS: top-level dirs in upstream but not in ours ===
echo "deletions:"
for dir in $(git ls-tree -d --name-only "$UPSTREAM" | sort); do
  if ! git ls-tree -d --name-only "$BRANCH" 2>/dev/null | grep -qx "$dir"; then
    echo "  - $dir/"
  fi
done
echo ""

# === PATCHES: files existing in both branches with different content ===
echo "patches:"

# Get all differing files (text only, exclude generated/lock files)
git diff --name-only "$BRANCH" "$UPSTREAM" -- \
  '*.go' '*.yaml' '*.yml' '*.xml' '*.ts' '*.tsx' '*.json' '*.jsx' '*.css' '*.toml' '*.mod' \
  ':(exclude)*.lock' ':(exclude)*.tgz' ':(exclude)*.gz' ':(exclude)*.zip' \
  ':(exclude)go.sum' \
  > "$WORKDIR/files.txt"

while IFS= read -r file; do
  # Both branches must have the file (not added/deleted)
  git show "${BRANCH}:${file}" >/dev/null 2>&1 || continue
  git show "${UPSTREAM}:${file}" >/dev/null 2>&1 || continue

  # Must actually differ
  git diff --quiet "$BRANCH" "$UPSTREAM" -- "$file" 2>/dev/null && continue

  # Save diff to temp file to avoid stdin/pipe issues in the while loop
  diff <(git show "${UPSTREAM}:${file}" 2>/dev/null) \
       <(git show "${BRANCH}:${file}" 2>/dev/null) \
       > "$WORKDIR/diff.txt" 2>/dev/null || true

  # Extract first meaningful line unique to our version
  signature=$(grep '^>' "$WORKDIR/diff.txt" \
    | sed 's/^> //' \
    | sed 's/^[[:space:]]*//' \
    | grep -vE '^$|^//|^#' \
    | sed -n '1p')
  [ -z "$signature" ] && continue

  # Count occurrences in our version for verification
  occurrences=$(git show "${BRANCH}:${file}" | grep -cF "$signature" 2>/dev/null || echo 0)

  echo "  - file: $file"
  echo "    signature: '$signature'"
  echo "    occurrences: $occurrences"
  echo ""
done < "$WORKDIR/files.txt"

# === ADDITIVE: files in ours not in upstream ===
echo "additive:"
comm -23 \
  <(git ls-tree -r --name-only "$BRANCH" | sort) \
  <(git ls-tree -r --name-only "$UPSTREAM" | sort) | \
  grep -v 'rezus-manifest.yaml' | \
  awk -F/ '{
    # Collapse to meaningful groups
    if ($1 == ".github" && $2 == "workflows") print "  - .github/workflows/"$3
    else if ($1 == "deploy" && $2 == "charts") print "  - deploy/charts/"$3"/"
    else if ($1 == "pkg" && NF >= 3) print "  - pkg/"$2"/"$3"/"
    else if ($1 == "cmd" && NF >= 3) print "  - cmd/"$2"/"$3
    else if ($1 == "scripts") print "  - scripts/"$2
    else if ($1 == "charts" && NF >= 3) print "  - charts/"$2"/"$3
    else print "  - "$0
  }' | sort -u
