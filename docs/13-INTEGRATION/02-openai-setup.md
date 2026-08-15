# OpenAI Setup

## 1. Purpose
Provides instructions for configuring the OpenAI integration, ensuring the Mitra AI companion functions correctly and securely.

## 2. Scope
Covers API key generation, Vercel AI SDK configuration, and organizational settings for privacy compliance.

## 3. Account Configuration

1. **Create an OpenAI Account**: Navigate to platform.openai.com.
2. **Organization Settings**:
   - Ensure you are on a paid tier (Tier 1+) to avoid severe rate limits that would break the streaming chat experience.
   - **CRITICAL PRIVACY STEP**: Go to Settings > Data Controls and explicitly ensure that "Data Sharing for Training" is disabled. MannMitra processes sensitive health/stress data which MUST NOT be used to train future public LLMs.

3. **Generate API Key**:
   - Create a new Project Key (do not use a legacy User Key).
   - Name it `mannmitra-prod` (or `-dev`).
   - Restrict the key permissions to only "Model capabilities" (disable Assistant API or Fine-tuning if not used) to minimize the blast radius of a leak.

## 4. Application Integration

1. **Environment Variables**:
   Add the generated key to `.env.local`:
   ```env
   OPENAI_API_KEY="sk-proj-..."
   ```

2. **SDK Verification**:
   The Vercel AI SDK `@ai-sdk/openai` automatically detects `OPENAI_API_KEY` in the environment. No explicit initialization is required.

## 5. Model Selection
- **Default Chat (Mitra)**: `gpt-4o` or `gpt-4o-mini` (depending on cost vs reasoning requirements). `mini` is highly recommended for the MVP due to speed and lower token cost.
- **Task Extraction / Classification**: `gpt-4o-mini` with `response_format: { type: "json_object" }` or using the SDK's `generateObject` function.

## 6. Fallback Testing
During local development, you can mock the OpenAI response to save credits and work offline by utilizing the `simulateStreamText` helper provided by the AI SDK documentation, or by using a local Ollama instance if the SDK is configured with a custom baseURL.
