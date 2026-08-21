# Man Mitra — RAG Knowledge Base & Multi-Signal Risk Engine

## Part 1 — Documents for your RAG knowledge base

Use only validated, public-domain / freely-licensed clinical instruments and official guidance — never copyrighted proprietary content. This also makes it far more defensible in front of SIH judges (they will ask "where did this come from").

**Screening instruments (public domain, safe to embed in your vector DB):**
- PHQ-9 (depression) — instrument + scoring manual
- GAD-7 (generalized anxiety) — instrument + scoring manual
- WHO-5 Well-Being Index — 5-item wellbeing screener, WHO copyright but free to use
- GHQ-12 (General Health Questionnaire) — general psychological distress screener

**Official guidance / self-help content:**
- WHO mhGAP Intervention Guide (mental health gap action programme) — structured guidance on common mental disorders, suitable for grounding chatbot responses
- WHO Problem Management Plus (PM+) — low-intensity psychological self-help techniques
- UGC / Ministry of Education student mental health advisories (India-specific — search "UGC mental health guidelines students")

**India-specific crisis and referral resources (essential for your counselor-escalation flow and for any crisis message the chatbot shows):**
- iCALL (TISS) psychosocial helpline
- Vandrevala Foundation helpline
- KIRAN mental health helpline (Ministry of Social Justice, Govt of India — 1800-599-0019)
- NIMHANS resources on student mental health

I've put the sources I could verify links for below — fetch and re-verify each PDF URL yourself before ingestion, since some mirrors (Scribd etc.) shouldn't be used for a production KB; go to the primary source (phqscreeners.com, who.int, official helpline sites) instead.

## Part 2 — Multi-signal risk engine design

### 2.1 Signal sources
| Source | What to extract | Refresh cadence |
|---|---|---|
| Planner section | missed/overdue tasks ratio, sudden drop in activity, late-night activity timestamps (proxy for sleep disruption) | daily rollup |
| Mood section | self-logged mood value, streak of low moods, volatility (swings), skipped check-ins | per entry |
| Chatbot | sentiment trend across sessions, escalating distress language, session frequency spike/drop | per session |
| Questionnaire (your "NHQ" screener, PHQ-9/GAD-7 if you adopt them) | raw subscale scores against published cutoffs | on submission |

Keep these as **separate signals in your schema** (`risk_signals` table: user_id, source, signal_type, value, timestamp) rather than pre-collapsing them — you need the breakdown later for the counselor's dashboard and for explainability.

### 2.2 Keyword/dictionary layer — design at the pattern level, not a literal script
Build a small classifier (or even a weighted keyword dictionary as a v1) that tags chatbot/planner-note text into **categories**, not individual trigger phrases hardcoded into a prompt:
- hopelessness / worthlessness language
- academic or social withdrawal language
- expressions of being a burden
- explicit crisis statements

For anything touching self-harm or suicide language specifically, don't build this as a bag-of-words matcher alone — it produces both false negatives (people phrase things differently) and false positives (dark humor, song lyrics, academic discussion). Two better approaches for a judge-appealing build:
1. Use an existing validated short-text risk classifier or a well-tested moderation/crisis-detection API as your first pass, with your own dictionary as a fallback/explainability layer, or
2. If you're hand-rolling it, keep the category list broad and weight it low relative to the validated questionnaire — the questionnaire score should be your primary signal, chat/planner/mood signals should nudge it, not override it.

I'd rather not hand you a literal phrase-by-phrase self-harm keyword bank — partly because a real one needs clinical review to avoid false positives/negatives, and partly because a hardcoded list is genuinely weak engineering (easy to route around, no context-awareness). A short-text classifier or an existing crisis-detection service will serve your project — and your judges — much better than a keyword dictionary, and I'm glad to help you design that architecture instead if useful.

### 2.3 Composite risk score
Weighted, normalized 0–100 composite, computed server-side (not by the chatbot LLM itself):

```
risk_score = 
    w_q  * questionnaire_severity      // PHQ-9/GAD-7/your NHQ, normalized 0-1
  + w_m  * mood_trend_score            // rolling 7/14-day decline, normalized 0-1
  + w_p  * planner_disengagement_score // missed tasks + inactivity, normalized 0-1
  + w_c  * chat_sentiment_score        // session-level sentiment trend, normalized 0-1
  + w_k  * keyword_flag_score          // capped, low weight, category-level flags
```

Suggested starting weights (tune with your mentor/counselor input, and say explicitly in your report that these need clinical calibration): questionnaire 0.4, mood 0.2, chat sentiment 0.15, planner 0.1, keyword flags 0.15 — but any explicit crisis-category keyword flag should be able to **force an immediate high-risk state independent of the weighted score**, since a single acute statement matters more than a rolling average.

### 2.4 Thresholds & counselor escalation
| Band | Score | Action |
|---|---|---|
| Low | 0–39 | No action; visible only in student's own mood history |
| Moderate | 40–64 | Suggest self-help resources in-app; log for periodic (weekly) counselor dashboard review |
| High | 65–84 | Immediate flag to counselor dashboard + notification; student shown helpline resources |
| Crisis | 85–100 or forced keyword trigger | Immediate counselor alert (push/SMS/email), crisis helpline numbers shown prominently to the student, escalation logged with timestamp and signal breakdown |

Design notes worth including in your report:
- **Human-in-the-loop, always.** The engine should never present itself to the student as a diagnosis — only as a signal that routes to a trained counselor. Say this explicitly in your SIH presentation; judges reward this.
- **Explainability.** The counselor's dashboard should show *why* a score is high (which signals contributed), not just the number.
- **Consent & privacy.** Log what data feeds the score and get explicit student consent for mood/chat monitoring; this is a strong point to raise with judges on the ethics side.
- **Audit trail.** Every escalation event should be immutable-logged (who was alerted, when, what triggered it).

### 2.5 Where an LLM fits vs. where it shouldn't
- Chatbot conversation → LLM (with RAG grounding from Part 1 docs) for supportive dialogue.
- Sentiment/category tagging of chat text → can be LLM-assisted, but keep it a separate call whose *output* (a small set of category tags/scores) feeds the deterministic scoring formula above — don't let the LLM itself compute or state the final risk score. Keep the arithmetic in your backend, deterministic and auditable.

## Part 3 — Bilingual keyword dictionary (Hindi/Marathi additions) + negation handling

Same category structure as before, extended with common Hindi/Marathi (Romanized + Devanagari) phrasings. This is still a v1 — get an actual counselor or Hindi-speaking psychology mentor to review this list before you rely on it for anything beyond a hackathon demo; phrasing varies a lot by region and register, and a wrong term here either misses real risk or over-flags harmless text.

```json
{
  "hopelessness": {
    "weight": 0.5,
    "terms_en": ["no point anymore", "nothing matters", "give up", "can't go on", "no way out", "pointless", "no future"],
    "terms_hi": ["ab koi fayda nahi", "kuch matlab nahi", "hosla toot gaya", "kuch nahi ho sakta", "sab bekar hai", "koi rasta nahi bacha", "अब कोई फ़ायदा नहीं", "कुछ मतलब नहीं"]
  },
  "worthlessness_burden": {
    "weight": 0.5,
    "terms_en": ["burden to everyone", "better off without me", "waste of space", "no one would care", "everyone hates me"],
    "terms_hi": ["sab par bojh hoon", "mere bina sab achha", "koi farak nahi padega", "sabko pareshan karta hoon", "मैं सब पर बोझ हूं", "मेरे बिना सब अच्छा"]
  },
  "withdrawal_isolation": {
    "weight": 0.3,
    "terms_en": ["don't want to see anyone", "stopped talking to", "alone all the time", "no one understands", "cut everyone off"],
    "terms_hi": ["kisi se baat nahi karni", "akela reh gaya hoon", "koi samajhta nahi", "sabse door ho gaya", "किसी से बात नहीं करनी", "अकेला रह गया हूं"]
  },
  "academic_distress": {
    "weight": 0.3,
    "terms_en": ["failing everything", "can't keep up", "going to fail", "parents will kill me", "backlog", "exam pressure"],
    "terms_hi": ["fail ho jaunga", "ghar wale gussa karenge", "backlog badh raha hai", "padhai ka pressure", "पढ़ाई का प्रेशर", "फेल हो जाऊंगा"]
  },
  "sleep_appetite_disruption": {
    "weight": 0.2,
    "terms_en": ["can't sleep", "haven't eaten", "up all night again", "no energy for anything"],
    "terms_hi": ["neend nahi aa rahi", "kuch khaya nahi", "raat bhar jaga raha", "नींद नहीं आ रही", "कुछ खाया नहीं"]
  },
  "explicit_crisis": {
    "weight": 1.0,
    "forceHighRisk": true,
    "terms_en": ["want to die", "want to end it", "kill myself", "end my life", "not want to be alive", "suicidal", "self harm", "hurting myself"],
    "terms_hi": ["marna chahta hoon", "zindagi khatam karni hai", "jeene ka mann nahi", "khud ko khatam", "जीना नहीं है", "खुद को खत्म करना", "मरना चाहता हूं"]
  }
}
```

**Negation check (apply before counting any match as a real hit):**
```python
NEGATION_WORDS = ["not", "don't", "doesn't", "never", "nahi", "na", "mat"]

def is_negated(text, match_start_idx, window=4):
    preceding_tokens = tokenize(text[:match_start_idx])[-window:]
    return any(neg in preceding_tokens for neg in NEGATION_WORDS)

def score_text(text, dictionary):
    matched_categories = set()
    force_crisis = False
    for category, data in dictionary.items():
        all_terms = data["terms_en"] + data.get("terms_hi", [])
        for term in all_terms:
            idx = text.lower().find(term.lower())
            if idx != -1 and not is_negated(text, idx):
                matched_categories.add(category)
                if data.get("forceHighRisk"):
                    force_crisis = True
    keyword_flag_score = min(1.0, sum(dictionary[c]["weight"] for c in matched_categories))
    return keyword_flag_score, force_crisis, matched_categories
```

Negation handling is a minimum bar, not a solution — "I never want to give up" and "I don't think I can go on" both break simple window-based negation. If you have time before submission, running this through even a basic sentiment/NLI model as a second pass will catch more of these than expanding the word list further.

## Part 4 — Full engine: reading all four signals and alerting the counselor

### 4.1 Data flow
```
[Planner events] ---\
[Mood log entries] ---\
[Chat messages]    ----> Signal Extractors (per source) --> risk_signals table --> Risk Aggregator --> risk_score + band
[Questionnaire]    ---/                                                                   |
                                                                                            v
                                                                                  if band >= HIGH:
                                                                                  Counselor Alert Service
                                                                                  (dashboard push + notification)
```

### 4.2 Per-source signal extractors (pseudocode)

```python
def planner_signal(user_id, window_days=14):
    tasks = get_tasks(user_id, window_days)
    missed_ratio = count(t for t in tasks if t.overdue) / max(len(tasks), 1)
    late_night_ratio = count(t for t in tasks if t.timestamp.hour >= 1 and t.timestamp.hour <= 4) / max(len(tasks), 1)
    activity_drop = compare_activity(user_id, this_week=window_days//2, prev_week=window_days//2)
    return normalize(0.5*missed_ratio + 0.3*late_night_ratio + 0.2*activity_drop)

def mood_signal(user_id, window_days=14):
    entries = get_mood_entries(user_id, window_days)
    if not entries: return 0.0  # no data != risk; handle missing data separately, see 4.4
    trend = linear_regression_slope([e.value for e in entries])  # negative slope = declining mood
    volatility = stdev([e.value for e in entries])
    skipped_ratio = 1 - (len(entries) / window_days)
    return normalize(0.5*max(0, -trend) + 0.3*volatility + 0.2*skipped_ratio)

def chat_signal(user_id, window_days=14):
    sessions = get_chat_sessions(user_id, window_days)
    sentiment_scores = [llm_extract_sentiment(s.transcript) for s in sessions]  # see 4.3 for prompt
    keyword_score, force_crisis, categories = score_text(
        " ".join(s.transcript for s in sessions), CRISIS_DICTIONARY
    )
    sentiment_trend = normalize(-avg_recent_slope(sentiment_scores))
    return normalize(0.5*sentiment_trend + 0.5*keyword_score), force_crisis, categories

def questionnaire_signal(user_id):
    latest = get_latest_questionnaire(user_id)  # your NHQ / PHQ-9 / GAD-7 submission
    return normalize_against_published_cutoffs(latest)
```

### 4.3 LLM call for chat sentiment/category extraction — sample system prompt

Use this as a **separate, narrow-scope call** — its only job is to output structured tags, never a risk score or advice:

```
You are a text classifier for a student support app. You will be given a chat
transcript between a student and a support chatbot. Your only task is to output
a JSON object describing emotional tone signals present in the STUDENT's
messages (ignore the bot's messages).

Output strictly this JSON shape, nothing else:
{
  "sentiment_score": <float -1.0 to 1.0, negative = more distress>,
  "categories_present": [<subset of: "hopelessness", "worthlessness_burden",
                          "withdrawal_isolation", "academic_distress",
                          "sleep_appetite_disruption", "explicit_crisis">],
  "confidence": <float 0.0 to 1.0>
}

Do not provide advice, commentary, a diagnosis, or a risk level. Do not
speculate beyond what the text states. If uncertain, lower the confidence
value rather than guessing.
```

### 4.4 Aggregation, missing-data handling, and counselor alerting

```python
def compute_risk(user_id):
    q  = questionnaire_signal(user_id)
    m  = mood_signal(user_id)
    p  = planner_signal(user_id)
    c, force_crisis, categories = chat_signal(user_id)

    weights = {"q": 0.4, "m": 0.2, "c": 0.15, "p": 0.1, "k_already_in_c": 0}
    score = 100 * (weights["q"]*q + weights["m"]*m + weights["c"]*c + weights["p"]*p)

    if force_crisis:
        band = "CRISIS"
        score = max(score, 90)
    elif score >= 85: band = "CRISIS"
    elif score >= 65: band = "HIGH"
    elif score >= 40: band = "MODERATE"
    else: band = "LOW"

    log_risk_event(user_id, score, band, {"q": q, "m": m, "p": p, "c": c, "categories": categories})

    if band in ("HIGH", "CRISIS"):
        alert_counselor(user_id, score, band, categories, urgency="immediate" if band == "CRISIS" else "same_day")

    return score, band
```

Handle missing signals explicitly — a student who hasn't used the mood tracker in two weeks shouldn't silently register as "0 risk" from that source. Treat missing data as a separate flag (e.g. `data_completeness` field shown to the counselor) rather than letting it default to a low-risk number.

### 4.5 Counselor alert payload
When `alert_counselor()` fires, the counselor dashboard should receive — not just a number:
```json
{
  "student_id": "...",
  "risk_band": "HIGH",
  "risk_score": 78,
  "signal_breakdown": {"questionnaire": 0.82, "mood": 0.6, "chat": 0.55, "planner": 0.3},
  "flagged_categories": ["hopelessness", "academic_distress"],
  "trigger_reason": "weighted_score",
  "timestamp": "...",
  "recommended_action": "Review chat/mood history and reach out within 24h"
}
```
For a `CRISIS`-band, forced-keyword trigger, mark `trigger_reason: "explicit_crisis_keyword"` distinctly — counselors should be able to tell "gradual decline flagged by the algorithm" apart from "student just said something acute right now," since the response urgency differs.