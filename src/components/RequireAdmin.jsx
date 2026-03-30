import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function RequireAdmin({ children, redirectTo = "/" }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const from = location.pathname + location.search + location.hash;

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setIsAuthed(Boolean(result?.isAuthed));
        setIsAdmin(result?.tier === "admin");
      } catch {
        if (!alive) return;

        setIsAuthed(false);
        setIsAdmin(false);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [location.pathname]);

  if (loading) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (!isAdmin) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from, adminRequired: true }}
      />
    );
  }

  return children;
}