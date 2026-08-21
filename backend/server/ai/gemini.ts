import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed } from 'ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set in the environment variables. The application might fail at runtime.');
}


// Vercel AI SDK Client for streamText and generative chats
export const google = createGoogleGenerativeAI({
  apiKey: apiKey || '',
});

/**
 * Generate embeddings using text-embedding-004 (768 dimensions)
 * @param text The text to embed
 * @returns number[] representing the embedding vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbeddingModel('gemini-embedding-2'),
    value: text,
  });
  return embedding;
}
