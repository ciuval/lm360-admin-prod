LM360 env pack

Contenuto
---------
.env                  → Copialo nella cartella del progetto che contiene la cartella "api"
api/health.js         → Endpoint di test: /api/health
api/ping.js           → Endpoint di test: /api/ping
README.txt

Come usare
----------
1) Estrai lo ZIP.
2) Copia ".env" in: C:\Users\Ellav\Downloads\lm360-admin-prod\lm360-admin-prod\.env
3) Apri .env e incolla i TUOI valori reali al posto dei placeholder:
     STRIPE_SECRET_KEY=sk_test_...
     SUPABASE_URL=https://feyjnhczcwmwxwrlybfj.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
     STRIPE_WEBHOOK_SECRET=whsec_...
   (Niente virgolette; niente spazi prima/dopo l'uguale.)
4) Copia anche la cartella "api" (o solo i file health.js/ping.js) dentro la cartella del progetto se non esistono già.
5) Avvia il dev server nella stessa cartella:
     npx vercel dev --listen 3000
6) Verifica:
     http://localhost:3000/api/ping
     http://localhost:3000/api/health

Note
----
- Questo .env è già codificato in UTF-8 con terminatori CRLF (Windows friendly).
- Se vedi 404 su /api/health o /api/ping, verifica di essere nella cartella giusta e che i file siano sotto "api/".
