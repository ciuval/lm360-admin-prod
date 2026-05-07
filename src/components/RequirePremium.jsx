import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function RequirePremium({ children, redirectTo = "/premium" }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  const from = location.pathname + location.search + location.hash;

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setIsAuthed(Boolean(result?.isAuthed));
        setHasPremiumAccess(
          result?.tier === "premium" ||
            result?.tier === "super" ||
            result?.tier === "admin"
        );
      } catch {
        if (!alive) return;

        setIsAuthed(false);
        setHasPremiumAccess(false);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [from]);

  if (loading) return null;

  if (!isAuthed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from, reason: "auth_required" }}
      />
    );
  }

  if (!hasPremiumAccess) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from, reason: "premium_required" }}
      />
    );
  }

  return children;
}