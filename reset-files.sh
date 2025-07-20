#!/bin/bash

echo "🧼 Pulizia in corso..."

// Pages
rm -f src/pages/App.jsx
rm -f src/pages/ProfilePage.jsx
rm -f src/pages/AdminDashboard.jsx
rm -f src/pages/AdminTest.jsx

// Lib
rm -f src/lib/supabaseClient.js

echo "✅ File eliminati."

sleep 1

# Ricreazione con nano (manualmente uno per volta)
nano src/pages/App.jsx
nano src/pages/ProfilePage.jsx
nano src/pages/AdminDashboard.jsx
nano src/pages/AdminTest.jsx
nano src/lib/supabaseClient.js

echo "🚀 Tutti i file sono stati ricreati. Pronti per incollare codice 
nuovo."

nano src/pages/App.jsx
nano src/pages/ProfilePage.jsx
nano src/pages/AdminDashboard.jsx
nano src/pages/AdminTest.jsx
nano src/lib/supabaseClient.js

