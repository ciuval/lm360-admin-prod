import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function RequireAuth({ children, redirectTo = "/login" }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const from = location.pathname + location.search + location.hash;

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const result = await loadCurrentAccountTier();

        if (!alive) return;
        setIsAuthed(Boolean(result?.isAuthed));
      } catch {
        if (!alive) return;
        setIsAuthed(false);
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
        to={redirectTo}
        replace
        state={{ from, reason: "auth_required" }}
      />
    );
  }

  return children;
}