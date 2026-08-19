# AI Integration

## 1. Purpose
Details how MannMitra integrates with external Large Language Models (LLMs) to power the Mitra AI companion, task extraction, and stress forecasting.

## 2. Scope
Covers SDK usage, prompt engineering patterns, streaming responses, and function calling (tool use).

## 3. Technology Stack
- **Provider**: OpenAI (gpt-4o or gpt-4o-mini) or Anthropic (claude-3-haiku).
- **Library**: Vercel AI SDK (`ai` and `@ai-sdk/openai`).

## 4. Implementation Patterns

### 4.1 Streaming Chat (Vercel AI SDK)
The Mitra chat interface relies on `useChat` from the Vercel AI SDK to stream tokens in real-time, reducing perceived latency.

```typescript
// Frontend
import { useChat } from 'ai/react';
const { messages, input, handleInputChange, handleSubmit } = useChat();

// Backend (/api/v1/ai/chat/route.ts)
import { streamText } from 'ai';
export async function POST(req: Request) {
  // 1. Fetch user context (recent tasks, stress level)
  // 2. Build system prompt
  // 3. Return streamText(...)
}
```

### 4.2 Function Calling (Structured Extraction)
To implement Feature 20 (AI Task Converter), the LLM must return structured JSON, not markdown text.
- Use `generateObject` or `streamObject` from the AI SDK, passing in a strict Zod schema for a `Task`.
- The AI will output an array of tasks which the backend can then insert directly into the `tasks` table.

## 5. RAG (Retrieval-Augmented Generation) Context
The AI must be "context-aware". Before calling the LLM, the backend fetches:
1. The user's name and academic profile.
2. The user's most recent 3 stress logs.
3. Any tasks due in the next 48 hours.
This context is injected invisibly into the `system` prompt, allowing Mitra to say: "I see you have a DBMS assignment due tomorrow, is that what's causing the stress?"

## 6. Security / Privacy
- **No Training**: The API integration MUST use the enterprise tier or explicitly configure the API call to opt-out of training (`zero data retention` if supported).
- **Prompt Injection Defense**: Ensure the system prompt heavily emphasizes that the AI must not deviate from its persona or execute unauthorized commands.

## 7. Testing
- Use the AI SDK's mocking capabilities to simulate an LLM response during integration tests to ensure the UI handles streaming and structured data correctly without incurring API costs.
