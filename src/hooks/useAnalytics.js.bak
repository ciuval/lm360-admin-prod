import { useCallback } from "react";
import { track as trackEvent } from "../lib/analytics";

// Hook minimale: espone track(name, props)
export function useAnalytics() {
  const track = useCallback((name, props = {}) => {
    return trackEvent(name, props);
  }, []);
  return { track };
}

export default useAnalytics;

