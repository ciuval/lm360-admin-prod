import { getJson, setJson } from './storage';
/** Prefetch route chunks per React.lazy (on hover/focus) */
const map = {
  discover: () => import('../pages/Discover'),
  likes: () => import('../pages/Likes'),
  matches: () => import('../pages/Matches'),
  chat: () => import('../pages/Chat'),
  premium: () => import('../pages/Premium'),
  signup: () => import('../pages/Signup'),
  privacy: () => import('../pages/Privacy'),
  termini: () => import('../pages/Terms'),
  guide: () => import('../pages/GuideIndex'),
  guidePost: () => import('../pages/GuidePost'),
};
export function prefetch(key) {
  try {
    map[key]?.();
  } catch {}
}
