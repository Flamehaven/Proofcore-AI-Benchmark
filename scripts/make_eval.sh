#!/bin/bash

# ProofCore Benchmark Evaluation Script
# Runs offline benchmarking on dataset.json
# Generates JSON and CSV reports in reports/ directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "ProofCore Benchmark Evaluation"
echo "============================================"
echo ""

# Check Python availability
if ! command -v python3 &> /dev/null; then
    echo "[!] Error: python3 not found"
    exit 1
fi

echo "[*] Environment:"
echo "    Project root: $PROJECT_ROOT"
echo "    Python: $(python3 --version)"
echo "    Mode: OFFLINE (no network required)"
echo ""

# Create reports directory
mkdir -p "$PROJECT_ROOT/reports"
echo "[*] Reports directory: $PROJECT_ROOT/reports"
echo ""

# Run evaluation
echo "[*] Running benchmark evaluation..."
cd "$PROJECT_ROOT"
python3 scripts/eval_bench.py

# Check output files
echo ""
echo "[*] Checking output files..."

if [ -f "$PROJECT_ROOT/reports/bench_v0_1.json" ]; then
    JSON_SIZE=$(wc -c < "$PROJECT_ROOT/reports/bench_v0_1.json")
    echo "[+] JSON report: bench_v0_1.json ($JSON_SIZE bytes)"
else
    echo "[-] Error: JSON report not found"
    exit 1
fi

if [ -f "$PROJECT_ROOT/reports/bench_v0_1.csv" ]; then
    CSV_LINES=$(wc -l < "$PROJECT_ROOT/reports/bench_v0_1.csv")
    echo "[+] CSV report: bench_v0_1.csv ($CSV_LINES lines)"
else
    echo "[-] Error: CSV report not found"
    exit 1
fi

echo ""
echo "[+] Benchmark complete!"
echo ""
echo "Results available in:"
echo "    - reports/bench_v0_1.json (detailed scores)"
echo "    - reports/bench_v0_1.csv (spreadsheet format)"
echo ""
echo "View results:"
echo "    cat reports/bench_v0_1.json | jq .meta"
echo "============================================"
