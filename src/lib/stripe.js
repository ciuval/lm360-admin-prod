import { supabase } from "./supabaseClient";
export async function openPremiumCheckout() {
  const { data: { user } } = await supabase.auth.getUser();
  const base = import.meta.env.VITE_STRIPE_PAY_LINK;
  if (!base) { alert("Pagamento non disponibile."); return; }
  const u = new URL(base);
  if (user?.id) u.searchParams.set("client_reference_id", user.id);
  if (user?.email) u.searchParams.set("prefilled_email", user.email);
  window.location.href = u.toString();
}
