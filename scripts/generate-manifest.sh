#!/bin/bash
# Generate rezus-manifest.yaml from the diff between rezus/main and upstream/main
# Usage: cd <fork-repo> && ./scripts/generate-manifest.sh > rezus-manifest.yaml
#
# This script captures ALL divergences from upstream by comparing the two branches.
# Run it after every upstream merge to regenerate the manifest.
# The sync workflow reads rezus-manifest.yaml to:
#   1. Delete permanent divergences (deletions)
#   2. Verify code patches survived the merge (patches)
#   3. Know what new files we carry (additive)
set -euo pipefail

BRANCH="${1:-rezus/main}"
UPSTREAM="${2:-upstream/main}"

# === HEADER ===
cat << HEADER
# Fork Divergence Manifest
# Generated: $(date -u +%Y-%m-%d)
# Source: git diff $BRANCH $UPSTREAM
#
# REGENERATE: ./scripts/generate-manifest.sh > rezus-manifest.yaml

HEADER

# === DELETIONS: top-level directories in upstream that don't exist in ours ===
echo "deletions:"
for dir in $(git ls-tree -d --name-only "$UPSTREAM" | sort); do
  if ! git ls-tree -d --name-only "$BRANCH" 2>/dev/null | grep -qx "$dir"; then
    echo "  - $dir/"
  fi
done
echo ""

# === PATCHES: files existing in both branches with different content ===
echo "patches:"
git diff --name-only "$BRANCH" "$UPSTREAM" -- \
  '*.go' '*.yaml' '*.yml' '*.xml' '*.ts' '*.tsx' '*.json' \
  ':(exclude)ee/' ':(exclude)cmd/enterprise/' \
  ':(exclude)*.lock' ':(exclude)*.tgz' ':(exclude)go.sum' \
  ':(exclude)deploy/charts/signoz-community/charts/' \
  ':(exclude)deploy/charts/signoz-community/tests/' \
  > /tmp/rezus-patch-files.txt

while IFS= read -r file; do
  git show "${BRANCH}:${file}" > /dev/null 2>&1 || continue
  git show "${UPSTREAM}:${file}" > /dev/null 2>&1 || continue
  git diff --quiet "$BRANCH" "$UPSTREAM" -- "$file" 2>/dev/null && continue

  # Extract first meaningful line unique to our version
  signature=$(diff <(git show "${UPSTREAM}:${file}" 2>/dev/null) <(git show "${BRANCH}:${file}" 2>/dev/null) | \
    grep '^>' | sed 's/^> //' | sed 's/^[[:space:]]*//' | grep -vE '^$|^//|^#' | head -1)
  [ -z "$signature" ] && continue

  # Count how many times this exact string appears in our version
  occurrences=$(git show "${BRANCH}:${file}" | grep -cF "$signature" 2>/dev/null || echo 0)

  echo "  - file: $file"
  echo "    signature: '$signature'"
  echo "    occurrences: $occurrences"
  echo ""
done < /tmp/rezus-patch-files.txt

# === ADDITIVE: files in ours not in upstream ===
echo "additive:"
comm -23 \
  <(git ls-tree -r --name-only "$BRANCH" | sort) \
  <(git ls-tree -r --name-only "$UPSTREAM" | sort) | \
  grep -v 'rezus-manifest.yaml' | \
  awk -F/ '{
    if ($1 == ".github" && $2 == "workflows") print "  - .github/workflows/"$3
    else if ($1 == "deploy" && $2 == "charts") print "  - deploy/charts/"$3"/"
    else if ($1 == "pkg" && NF >= 3) print "  - pkg/"$2"/"$3"/"
    else if ($1 == "cmd" && NF >= 3) print "  - cmd/"$2"/"$3
    else if ($1 == "scripts") print "  - scripts/"$2
    else print "  - "$0
  }' | sort -u
