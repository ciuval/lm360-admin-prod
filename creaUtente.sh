#!/bin/bash

# Script: creaUtente.sh
# Crea un utente Supabase confermato via API admin

SUPABASE_URL="https://feyjnhczcwmwxwrlybfj.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZleWpuaGN6Y3dtd3h3cmx5YmZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA5ODUwNiwiZXhwIjoyMDYzNjc0NTA2fQ.WcYXt-wrMGRBXdp9MZAekgbanQSUPMjnqUWirnvDwk8"
EMAIL="vale-test@example.com"
PASSWORD="ValeTest123!"

curl -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "password": "'$PASSWORD'",
    "email_confirm": true
  }'
