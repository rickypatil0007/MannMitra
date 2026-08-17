# Mitra AI Architecture Documentation

## Overview
Mitra AI is a personalized student wellness companion for MannMitra. The architecture has been completely isolated to ensure stability, maintainability, and strict separation of concerns.

## Directory Structure

### `src/features/mitra-ai/`
The client-side boundary for the AI companion.
- **`components/`**: Strict UI components.
  - `MitraChat.tsx`: The main orchestrator container.
  - `MitraInput.tsx`: The composer (handles text and voice).
  - `MitraMessageList.tsx`: Renders the conversation.
  - `MitraMessage.tsx`: Renders a single message (User or Assistant, handles tool invocation UI).
  - `MitraErrorState.tsx`: Fallback UI for timeouts or network failures.
- **`hooks/`**: 
  - `useMitraChat.ts`: A state machine wrapping Vercel's `useChat`, enforcing states (`idle`, `sending`, `responding`, `success`, `error`) and abstracting the API call.
- **`services/`**:
  - `mitra-client.ts`: Maintains the configuration for API paths to ensure the UI never talks directly to the AI provider.
- **`types/`**:
  - `mitra.types.ts`: Strict typings (`MitraMessage`, `MitraChatState`, etc.). No `any` types allowed for core logic.

### `src/server/mitra/`
The strictly isolated backend boundary.
- `mitra.provider.ts`: Manages the connection to the underlying LLM (Nvidia Llama 3.1) and houses the core `SYSTEM_PROMPT`. Includes fallback API key logic to prevent hard crashes.
- `mitra.service.ts`: Handles all database operations (saving messages to PostgreSQL) and tool executions (e.g., creating tasks in Prisma).
- `mitra.validation.ts`: Zod schemas for input validation and tool arguments (e.g., `CreateTaskSchema`).

### `src/app/api/mitra/chat/route.ts`
The single HTTP endpoint connecting the feature layer to the server layer.
- Uses `streamText` from `ai` SDK.
- Implements robust error handling (try/catch wraps the entire stream).
- Extracts Firebase authentication logic securely.

## Why this Architecture?
1. **Isolation**: Changes in `mitra/page.tsx` (like sidebar styling) will no longer break the chatbot's state machine.
2. **Error Handling**: The `useMitraChat` hook tracks explicit states and handles network timeouts securely without crashing the UI.
3. **Safety**: Server-side logic (Prisma) is strictly forbidden in the `features/` directory, and AI configurations are forbidden in the UI.

## Adding New Tools
1. Define the Zod schema in `src/server/mitra/mitra.validation.ts`.
2. Write the execution logic in `src/server/mitra/mitra.service.ts`.
3. Register the tool in `src/app/api/mitra/chat/route.ts` under the `tools` object.
4. The UI (`MitraMessage.tsx`) will automatically render a loading state when the new tool is invoked by the AI.
