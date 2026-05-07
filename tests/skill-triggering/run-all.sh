#!/usr/bin/env bash
# Run all skill-triggering tests.
# Usage: run-all.sh [--verbose] [--filter <glob>]
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPTS_DIR="$SCRIPT_DIR/prompts"
VERBOSE=false
FILTER="*"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --verbose) VERBOSE=true; shift ;;
    --filter)  FILTER="$2"; shift 2 ;;
    *) echo "Unknown flag: $1" >&2; exit 1 ;;
  esac
done

PASS=0
FAIL=0
FAIL_LIST=()

for prompt in "$PROMPTS_DIR"/$FILTER.txt; do
  [[ -f "$prompt" ]] || continue
  BASENAME="$(basename "$prompt" .txt)"

  if $VERBOSE; then
    bash "$SCRIPT_DIR/run-test.sh" "$prompt" && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); FAIL_LIST+=("$BASENAME"); }
  else
    OUTPUT="$(bash "$SCRIPT_DIR/run-test.sh" "$prompt" 2>&1)"
    STATUS=$?
    if [[ $STATUS -eq 0 ]]; then
      echo "PASS  $BASENAME"
      PASS=$((PASS+1))
    else
      echo "FAIL  $BASENAME"
      FAIL=$((FAIL+1))
      FAIL_LIST+=("$BASENAME")
      # Print log location from output
      echo "$OUTPUT" | grep "See full log" || true
    fi
  fi
done

echo ""
echo "Results: $PASS passed, $FAIL failed"

if [[ ${#FAIL_LIST[@]} -gt 0 ]]; then
  echo "Failed:"
  for f in "${FAIL_LIST[@]}"; do
    echo "  - $f"
  done
  exit 1
fi
