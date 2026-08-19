export type MitraRole = "user" | "assistant" | "system" | "data";

export interface MitraMessage {
  id: string;
  role: MitraRole;
  content: string;
  createdAt: string;
  toolInvocations?: any[];
}

export type MitraChatState = "idle" | "sending" | "responding" | "success" | "error";

export interface MitraChatRequest {
  messages: Omit<MitraMessage, "createdAt" | "toolInvocations">[];
  firebaseUid: string;
  conversationId: string | null;
}

export interface MitraChatResponse {
  success: boolean;
  message?: MitraMessage;
  error?: {
    code: string;
    message: string;
  };
}

export type MitraErrorCode = 
  | "INVALID_REQUEST"
  | "UNAUTHORIZED"
  | "AI_PROVIDER_ERROR"
  | "AI_TIMEOUT"
  | "AI_RATE_LIMITED"
  | "AI_EMPTY_RESPONSE"
  | "CONFIGURATION_ERROR"
  | "INTERNAL_ERROR";
