#!/usr/bin/env bash
set -euo pipefail

WSL_IP="$(hostname -I | awk '{print $1}')"

echo ""
echo "=============================================="
echo "  PerpPilot TON — dev server"
echo "=============================================="
echo "  WSL (inside Linux):  http://localhost:3000"
echo "  Windows browser:     http://localhost:3000"
if [[ -n "${WSL_IP}" ]]; then
  echo "  If localhost fails:  http://${WSL_IP}:3000"
fi
echo "  Manifest check:      http://localhost:3000/tonconnect-manifest.json"
echo "=============================================="
echo ""

exec next dev --hostname localhost --port 3000
