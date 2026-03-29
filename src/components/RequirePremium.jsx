import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAccountTier from "../hooks/useAccountTier";

export default function RequirePremium({ children, redirectTo = "/premium" }) {
  const location = useLocation();
  const { loading, isAuthed, hasPremiumAccess } = useAccountTier(location.pathname);

  const from = location.pathname + location.search + location.hash;

  if (loading) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (!hasPremiumAccess) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from, premiumRequired: true }}
      />
    );
  }

  return children;
}