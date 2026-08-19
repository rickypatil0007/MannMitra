# MANNMITRA — TASK EXTRACTION

Document: `04-AI/06-task-extraction.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Backend Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To seamlessly turn conversational text into structured academic tasks in the student's Planner, reducing the friction of manual data entry.

---

# 2. USER EXPERIENCE

**Scenario:** 
User: "I have a math assignment due this Friday and I haven't started."
Mitra: "That sounds stressful, but we can manage it. I've added it to your planner. Want to break it down into smaller steps?"
*(UI renders a card showing the newly created task)*

---

# 3. IMPLEMENTATION (FUNCTION CALLING)

The LLM will be provided with a `create_task` tool.

**Tool Schema (JSON Schema):**
```json
{
  "name": "create_task",
  "description": "Creates a new task in the student's planner.",
  "parameters": {
    "type": "object",
    "properties": {
      "title": { "type": "string", "description": "A concise title for the task." },
      "due_date": { "type": "string", "format": "date-time", "description": "ISO 8601 date, if mentioned." },
      "priority": { "type": "string", "enum": ["LOW", "MEDIUM", "HIGH"] }
    },
    "required": ["title"]
  }
}
```

---

# 4. EXECUTION FLOW

1. Orchestrator detects the `create_task` tool call in the LLM stream.
2. Orchestrator pauses text streaming (or handles it in parallel).
3. Backend validates the arguments.
4. Backend inserts the row into the `Task` database table.
5. Backend injects a UI-component payload into the chat stream so the frontend can render a "Task Created" card inline.

---

# 5. ACCURACY & CORRECTIONS

- The LLM must not guess deadlines. If a user says "I have an exam soon," the due_date should be `null` and Mitra should ask, "When is the exam?"
- The user MUST be able to click the inline task card in the chat to edit or delete the extracted task if the AI got it wrong.
