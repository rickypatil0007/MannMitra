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
