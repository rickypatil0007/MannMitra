export const CRISIS_DICTIONARY = {
  hopelessness: {
    weight: 0.5,
    terms_en: ["no point anymore", "nothing matters", "give up", "can't go on", "no way out", "pointless", "no future"],
    terms_hi: ["ab koi fayda nahi", "kuch matlab nahi", "hosla toot gaya", "kuch nahi ho sakta", "sab bekar hai", "koi rasta nahi bacha", "अब कोई फ़ायदा नहीं", "कुछ मतलब नहीं"]
  },
  worthlessness_burden: {
    weight: 0.5,
    terms_en: ["burden to everyone", "better off without me", "waste of space", "no one would care", "everyone hates me"],
    terms_hi: ["sab par bojh hoon", "mere bina sab achha", "koi farak nahi padega", "sabko pareshan karta hoon", "मैं सब पर बोझ हूं", "मेरे बिना सब अच्छा"]
  },
  withdrawal_isolation: {
    weight: 0.3,
    terms_en: ["don't want to see anyone", "stopped talking to", "alone all the time", "no one understands", "cut everyone off"],
    terms_hi: ["kisi se baat nahi karni", "akela reh gaya hoon", "koi samajhta nahi", "sabse door ho gaya", "किसी से बात नहीं करनी", "अकेला रह गया हूं"]
  },
  academic_distress: {
    weight: 0.3,
    terms_en: ["failing everything", "can't keep up", "going to fail", "parents will kill me", "backlog", "exam pressure"],
    terms_hi: ["fail ho jaunga", "ghar wale gussa karenge", "backlog badh raha hai", "padhai ka pressure", "पढ़ाई का प्रेशर", "फेल हो जाऊंगा"]
  },
  sleep_appetite_disruption: {
    weight: 0.2,
    terms_en: ["can't sleep", "haven't eaten", "up all night again", "no energy for anything"],
    terms_hi: ["neend nahi aa rahi", "kuch khaya nahi", "raat bhar jaga raha", "नींद नहीं आ रही", "कुछ खाया नहीं"]
  },
  explicit_crisis: {
    weight: 1.0,
    forceHighRisk: true,
    terms_en: ["want to die", "want to end it", "kill myself", "end my life", "not want to be alive", "suicidal", "self harm", "hurting myself"],
    terms_hi: ["marna chahta hoon", "zindagi khatam karni hai", "jeene ka mann nahi", "khud ko khatam", "जीना नहीं है", "खुद को खत्म करना", "मरना चाहता हूं"]
  }
};

const NEGATION_WORDS = ["not", "don't", "doesn't", "never", "nahi", "na", "mat"];

function tokenize(text: string): string[] {
  // Split on boundaries and remove empty strings
  return text.toLowerCase().split(/\b/).filter(t => t.trim().length > 0);
}

function isNegated(text: string, matchStartIdx: number, window = 4): boolean {
  const precedingText = text.substring(0, matchStartIdx);
  const precedingTokens = tokenize(precedingText);
  // Get the last `window` tokens
  const relevantTokens = precedingTokens.slice(-window);
  return relevantTokens.some(token => NEGATION_WORDS.includes(token));
}

export function scoreText(text: string) {
  const matchedCategories = new Set<string>();
  let forceCrisis = false;
  let rawText = text.toLowerCase();

  for (const [category, data] of Object.entries(CRISIS_DICTIONARY)) {
    const allTerms = [...data.terms_en, ...(data.terms_hi || [])];
    
    for (const term of allTerms) {
      const idx = rawText.indexOf(term.toLowerCase());
      if (idx !== -1 && !isNegated(rawText, idx)) {
        matchedCategories.add(category);
        if ((data as any).forceHighRisk) {
          forceCrisis = true;
        }
      }
    }
  }

  let keywordFlagScore = 0;
  for (const category of matchedCategories) {
    keywordFlagScore += (CRISIS_DICTIONARY as any)[category].weight;
  }
  
  keywordFlagScore = Math.min(1.0, keywordFlagScore);

  return {
    keywordFlagScore,
    forceCrisis,
    matchedCategories: Array.from(matchedCategories)
  };
}
