interface UserProfile {
  name?: string;
  photo?: string;
  bio?: string;
  interests?: string[];
}

export function calculateMatchScore(profile: UserProfile): number {
  let score = 0;

  if (profile.name) score += 20;
  if (profile.photo) score += 30;
  if (profile.bio) score += 20;
  if (profile.interests && profile.interests.length >= 3) score += 30;

  return Math.min(score, 100); // cap a 100
}