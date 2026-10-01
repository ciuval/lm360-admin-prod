import { createClient } from "@supabase/supabase-js";

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, RLS_TEST_EMAIL, RLS_TEST_PASSWORD } = process.env;
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY || !RLS_TEST_EMAIL || !RLS_TEST_PASSWORD) {
  console.error("Configura URL, chiave pubblica e credenziali di prova nelle variabili d'ambiente.");
  process.exitCode = 1;
} else {
  const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
  const { error } = await supabase.auth.signInWithPassword({
    email: RLS_TEST_EMAIL,
    password: RLS_TEST_PASSWORD,
  });
  if (error) {
    console.error("Accesso di prova non riuscito.");
    process.exitCode = 1;
  } else {
    console.log("Accesso di prova riuscito. Verificare le policy RLS separatamente.");
    await supabase.auth.signOut();
  }
}
