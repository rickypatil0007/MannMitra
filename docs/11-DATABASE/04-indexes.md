# Indexes

## 1. Purpose
To ensure the PostgreSQL database remains performant as the student population grows, specifically detailing which columns require B-Tree or specialized indexing.

## 2. Scope
Covers indexing strategies for fast lookups, chronological sorting, and text searching.

## 3. Mandatory Indexes

### 3.1 Foreign Keys
Every foreign key column must be indexed. PostgreSQL does not do this automatically.
```sql
CREATE INDEX idx_tasks_student_id ON tasks(student_id);
CREATE INDEX idx_stress_logs_student_id ON stress_logs(student_id);
CREATE INDEX idx_messages_conversation_id ON mitra_messages(conversation_id);
```

### 3.2 Chronological Sorting
Most queries in MannMitra (e.g., loading the chat, viewing tasks) order by time.
```sql
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_messages_created_at ON mitra_messages(created_at DESC);
```

## 4. Specialized Indexes

### 4.1 Full-Text Search (Personal Notes)
To allow students to quickly search their diaries (Feature 27).
```sql
CREATE INDEX idx_diary_content_search ON personal_notes 
USING GIN (to_tsvector('english', content));
```

### 4.2 AI Vector Search (Future Proofing)
If `pgvector` is used for semantic matching of community posts or RAG context:
```sql
-- Assuming a vector column 'embedding' of size 1536 (OpenAI ada-002)
CREATE INDEX idx_community_posts_embedding ON community_posts 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

## 5. Security / Privacy
- Indexes consume disk space and can theoretically leak information through timing attacks if poorly configured, though this is negligible in a standard SaaS context. Ensure that indexes are rebuilt periodically during maintenance windows to maintain query efficiency.

## 6. Testing
- Use `EXPLAIN ANALYZE` in a staging environment loaded with 1,000,000 dummy chat messages to ensure the query for a single user's chat history executes in under 50ms and utilizes an Index Scan rather than a Sequential Scan.
