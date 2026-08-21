import { getEmbedding } from '../ai/gemini';
import { prisma } from '@/database/prisma';

/**
 * Splits text into chunks of approximately chunkLength words, with overlap.
 */
export function chunkText(text: string, chunkLength = 250, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkLength - overlap) {
    const chunk = words.slice(i, i + chunkLength).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

/**
 * Ingest a document into the pgvector database by chunking and embedding.
 */
export async function ingestDocument(content: string, source: string, metadata: any = {}) {
  console.log(`[Ingestion] Starting ingestion for source: ${source}`);
  
  const chunks = chunkText(content);
  console.log(`[Ingestion] Created ${chunks.length} chunks from ${source}.`);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    try {
      // 1. Generate embedding vector
      const embedding = await getEmbedding(chunk);
      
      // 2. Format as Postgres array string for pgvector mapping
      const embeddingVector = `[${embedding.join(',')}]`;
      
      // 3. Insert using raw query to support vector type
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO "RagDocument" (id, content, source, metadata, embedding, "createdAt")
        VALUES (
          gen_random_uuid(),
          $1,
          $2,
          $3::jsonb,
          $4::vector,
          NOW()
        )
        `,
        chunk,
        source,
        JSON.stringify({ ...metadata, chunkIndex: i }),
        embeddingVector
      );
      
    } catch (e) {
      console.error(`[Ingestion] Failed to embed/store chunk ${i} for ${source}:`, e);
    }
  }
  
  console.log(`[Ingestion] Finished ingestion for source: ${source}`);
}
