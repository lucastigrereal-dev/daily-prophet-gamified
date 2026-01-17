#!/bin/bash

SUPABASE_URL="https://damxbdkteskryonvgvpc.supabase.co"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbXhiZGt0ZXNrcnlvbnZndnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODY2OTEsImV4cCI6MjA4MjQ2MjY5MX0.cU2B2Qcwzt5DiRxzeicw68_NWfa2oh1nO3E4e5TPDus"

echo "Creating test postpack..."
curl -s -X POST "$SUPABASE_URL/rest/v1/postpacks" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"title":"Teste Produtividade","objective":"Testar sistema","format":"reel"}' | python -m json.tool

echo ""
echo "Done!"
