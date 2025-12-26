// ✅ File: src/utils/logEvento.js
import { supabase } from '../lib/supabaseClient';

export async function logEvento(userId, tipo, descrizione = '', pagina = window.location.pathname) {
  if (!userId) return;
  await supabase.from('log_attività').insert({
    user_id: userId,
    tipo_azione: tipo,
    descrizione,
    pagina,
  });
}

// ✅ Esempi di utilizzo:
// await logEvento(user.id, "LOGIN", "Accesso effettuato");
// await logEvento(user.id, "LIKE", "Hai messo like a Mario");
// await logEvento(user.id, "LOGOUT", "Disconnessione manuale");
