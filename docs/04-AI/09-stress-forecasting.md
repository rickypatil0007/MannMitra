# MANNMITRA — AI STRESS FORECASTING

Document: `04-AI/09-stress-forecasting.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Backend Engineers
Platform: Backend AI Service / Scheduled Jobs

---

# 1. PURPOSE

To generate the insights displayed in the `08-stress-forecast.md` UI. This system looks at future events and past data to generate a supportive text summary.

---

# 2. GENERATION WORKFLOW

1. **Trigger:** Runs via a daily background cron job (or on-demand when the user views the dashboard for the first time that week).
2. **Data Assembly:**
   - Fetch tasks/events for days +1 to +14.
   - Fetch historical stress levels for the past 30 days.
3. **LLM Evaluation:**
   - A specialized, non-conversational LLM call is made.
   - *Prompt:* "Look at this schedule. Identify the busiest days. Write one supportive sentence helping the student prepare. Do not predict their emotions."
4. **Storage:**
   - The generated text is cached in the database (e.g., `WeeklyInsight` table) to avoid calling the LLM every time the dashboard loads.

---

# 3. LIMITATIONS

- The forecast must NEVER say: "You will have a panic attack on Friday."
- Acceptable output: "Friday has 3 major deadlines. It might be helpful to finish the reading by Wednesday to keep the end of the week clear."
