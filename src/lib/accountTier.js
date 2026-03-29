import { supabase } from "./supabaseClient";

export function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

export function isAdminRole(value) {
  return normalizeRole(value) === "admin";
}

export function isPremiumRole(value) {
  return ["premium", "super"].includes(normalizeRole(value));
}

export function isFutureDate(value) {
  if (!value) return false;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;

  return time > Date.now();
}

export function hasActiveSubscriptionFromProfile(profile) {
  return isFutureDate(profile?.premium_fine);
}

export function getTierFromProfile(profile) {
  const role = normalizeRole(profile?.ruolo);

  if (role === "admin") return "admin";
  if (role === "super") return "super";

  if (
    Boolean(profile?.premium) ||
    role === "premium" ||
    hasActiveSubscriptionFromProfile(profile)
  ) {
    return "premium";
  }

  return "free";
}

export async function loadCurrentAccountTier() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const user = session?.user ?? null;

  if (!user?.id) {
    return {
      isAuthed: false,
      tier: "free",
      isPremium: false,
      user: null,
      profile: null,
      source: "guest",
    };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profili")
    .select("id, premium, ruolo, premium_fine, tipo_abbonamento, stripe_customer_id, status_account")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const tier = getTierFromProfile(profileData);
  const isPremium = tier === "premium" || tier === "super";

  return {
    isAuthed: true,
    tier,
    isPremium,
    user,
    profile: profileData || null,
    source: "profile",
  };
}