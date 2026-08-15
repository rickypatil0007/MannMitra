# MANNMITRA — COMMUNITY SYSTEM OVERVIEW

Document: `05-COMMUNITY/01-community-system.md`
Status: Production Specification
Version: 1.0
Audience: Product, Backend Engineers
Platform: Backend / Frontend

---

# 1. PURPOSE

The Community System provides a peer-to-peer support network. It is designed to foster connection and reduce isolation, strictly prioritizing psychological safety over engagement metrics.

---

# 2. ARCHITECTURE OVERVIEW

The system consists of:
1. **Anonymous Identity Service:** Issues and manages pseudonyms.
2. **Content Feed:** Serves text posts in a safe, moderated order.
3. **Interaction Layer:** Handles "Support" reactions and comments.
4. **Moderation Engine:** Automated filtering and human reporting queues.

---

# 3. CORE PRINCIPLES

- **Anti-Virality:** No share buttons. No follower counts. No trending topics. The goal is support, not influence.
- **Safe by Default:** Posts containing flagged keywords are held for moderation before being published.
- **Identity Protection:** A student's real identity is walled off from their community activity at the database layer.

---

# 4. DEPENDENCIES

- Relational Database (Postgres) for structured post/comment relationships.
- Automated Content Moderation API (e.g., OpenAI Moderation API or AWS Comprehend).

---

# 5. DATA RETENTION

- To minimize liability and privacy risks, community posts should automatically expire or be archived after a defined period (e.g., 30 or 90 days), rather than persisting forever.
