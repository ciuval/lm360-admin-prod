import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../hooks/useSession.jsx";

export default function RequireAuth({ children, redirectTo = "/login" }) {
  const { user, loading } = useSession();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname + location.search + location.hash }}
      />
    );
  }

  return children;
}