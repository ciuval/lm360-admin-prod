/** Prefetch route chunks per React.lazy (on hover/focus) */
const map = {
  discover: () => import("../pages/Discover"),
  likes:    () => import("../pages/Likes"),
  matches:  () => import("../pages/Matches"),
  chat:     () => import("../pages/Chat"),
  premium:  () => import("../pages/Premium"),
  signup:   () => import("../pages/Signup"),
  privacy:  () => import("../pages/Privacy"),
  termini:  () => import("../pages/Terms")
};
export function prefetch(key){ try{ map[key]?.(); } catch {} }
