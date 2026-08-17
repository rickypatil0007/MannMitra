export type Companion = {
  id: string;
  name: string;
  anonymousName: string;
  avatar?: string;
  branch?: string;
  year?: string;
  interests: string[];
  bio: string;
  availability: string;
  matchReason?: string;
  verified?: boolean;
};

export type MatchResult = Companion & {
  sharedInterests: string[];
  matchScore: number;
};

export const companionDemoData: Companion[] = [
  {
    id: "c1",
    name: "Alex",
    anonymousName: "Alex",
    interests: ["AI / ML", "Hackathons", "Startups", "Python"],
    bio: "Currently exploring machine learning and participating in hackathons. Always interested in discussing project ideas.",
    availability: "Evenings",
  },
  {
    id: "c2",
    name: "Sam",
    anonymousName: "Sam",
    interests: ["DSA", "Competitive Programming", "Placement Preparation"],
    bio: "Preparing for technical interviews and practicing DSA regularly.",
    availability: "Weekends",
  },
  {
    id: "c3",
    name: "Jay",
    anonymousName: "Jay",
    interests: ["Gaming", "Web Development", "UI/UX"],
    bio: "Frontend developer who enjoys gaming and experimenting with interactive interfaces.",
    availability: "Evenings",
  },
  {
    id: "c4",
    name: "Riya",
    anonymousName: "Riya",
    interests: ["Photography", "Music", "Movies"],
    bio: "Photography enthusiast who enjoys discovering new music and films.",
    availability: "Flexible",
  },
  {
    id: "c5",
    name: "Student #204",
    anonymousName: "Student #204",
    interests: ["Cybersecurity", "Cloud Computing", "Hackathons"],
    bio: "Learning about penetration testing and setting up secure cloud infrastructure.",
    availability: "Weekends",
  },
  {
    id: "c6",
    name: "Student #317",
    anonymousName: "Student #317",
    interests: ["Sports", "Fitness", "Design"],
    bio: "Passionate about playing football and maintaining a healthy lifestyle while balancing design projects.",
    availability: "Mornings",
  }
];

export const POPULAR_INTERESTS = [
  "AI / ML",
  "Web Development",
  "App Development",
  "DSA",
  "Competitive Programming",
  "Hackathons",
  "Startups",
  "Entrepreneurship",
  "Gaming",
  "Photography",
  "Music",
  "Movies",
  "Sports",
  "Fitness",
  "Design",
  "Cybersecurity",
  "Cloud Computing",
  "Robotics",
  "Public Speaking",
  "Career / Placements"
];

export function searchCompanions(query: string, selectedInterests: string[]): MatchResult[] {
  // Normalize search tokens
  const queryTokens = query
    .toLowerCase()
    .replace(/[.,]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 1);

  // Helper to check if a token matches an interest
  const isMatch = (interest: string, tokens: string[]) => {
    const lowerInterest = interest.toLowerCase();
    // Direct match against selected chips
    if (selectedInterests.some(si => si.toLowerCase() === lowerInterest)) {
      return true;
    }
    
    // Fuzzy match against query tokens
    return tokens.some(token => 
      lowerInterest.includes(token) || 
      // Handle special cases like "AI" matching "AI / ML"
      (token === "ai" && lowerInterest.includes("ai")) ||
      (token === "ml" && lowerInterest.includes("ml")) ||
      (token === "placement" && lowerInterest.includes("placement"))
    );
  };

  const results: MatchResult[] = [];

  for (const companion of companionDemoData) {
    const sharedInterests = companion.interests.filter(interest => isMatch(interest, queryTokens));
    
    // Also check if bio contains query tokens to boost score or find implicit matches
    const bioTokens = companion.bio.toLowerCase().replace(/[.,]/g, "").split(/\s+/);
    let bioMatchCount = 0;
    for (const token of queryTokens) {
       if (bioTokens.includes(token)) bioMatchCount += 0.5; // bio matches are worth half an interest
    }

    const matchScore = sharedInterests.length + bioMatchCount;

    if (matchScore > 0 || (selectedInterests.length === 0 && query.trim() === "")) {
      results.push({
        ...companion,
        sharedInterests,
        matchScore
      });
    }
  }

  // Sort by match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function getMatchLabel(score: number): { text: string, color: string } {
  if (score >= 3) return { text: "Excellent Match", color: "text-green-600 bg-green-50" };
  if (score >= 2) return { text: "Strong Match", color: "text-blue-600 bg-blue-50" };
  return { text: "Possible Match", color: "text-orange-600 bg-orange-50" };
}
