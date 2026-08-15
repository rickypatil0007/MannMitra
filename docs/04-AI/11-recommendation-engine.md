# MANNMITRA — RECOMMENDATION ENGINE

Document: `04-AI/11-recommendation-engine.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Backend Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To suggest relevant resources (from the Comfort Library), community stories, or support options proactively during conversations or on the Dashboard, reducing the burden on the student to search for help.

---

# 2. IMPLEMENTATION

This is NOT a complex collaborative-filtering ML model for MVP. It is a semantic search or rules-based tagging system integrated with the LLM.

**Tool Access:**
The LLM is provided with a `search_comfort_library(query)` tool.

**Workflow:**
1. User: "I can't stop my heart from racing, I'm so stressed about this test."
2. Orchestrator detects distress.
3. LLM calls `search_comfort_library("anxiety breathing exercise")`.
4. Backend executes a vector search (pgvector) or full-text search against the `LibraryResource` table.
5. Backend returns the Top 2 results to the LLM.
6. LLM responds: "It sounds like you're feeling really overwhelmed right now. Sometimes a quick breathing exercise can help slow things down. Here is one you can try: [Link to Resource]."

---

# 3. SAFETY

The recommendation engine MUST NEVER recommend community posts that have a high number of reports or have not been moderated, as it risks exposing a vulnerable student to harmful content.
