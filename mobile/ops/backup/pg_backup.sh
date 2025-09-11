#!/usr/bin/env bash
# ops/backup/pg_backup.sh — Dumps DB to ./ops/backup/backups with timestamped filename.
set -euo pipefail
: "${DATABASE_URL:?DATABASE_URL not set}"
OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/backups"
mkdir -p "$OUT_DIR"
TS="$(date +%Y%m%d_%H%M%S)"
OUT="$OUT_DIR/doman a_${TS}.dump"
pg_dump "$DATABASE_URL" --format=custom --file="$OUT"
echo "Backup written: $OUT"
