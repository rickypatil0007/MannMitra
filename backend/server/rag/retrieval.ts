import { getEmbedding } from '../ai/gemini';
import { prisma } from '@/database/prisma';

export async function retrieveRelevantContext(query: string, topK: number = 5): Promise<string> {
  try {
    const embedding = await getEmbedding(query);
    const vectorString = `[${embedding.join(',')}]`;
    
    // Using pgvector <=> operator for Cosine distance
    const results = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT content, source, 1 - (embedding <=> $1::vector) AS similarity
      FROM "RagDocument"
      ORDER BY embedding <=> $1::vector
      LIMIT $2
      `,
      vectorString,
      topK
    );
    
    if (!results || results.length === 0) {
      return '';
    }
    
    // Format the retrieved context for the LLM
    return results.map(row => `Source: ${row.source}\nContent:\n${row.content}`).join('\n---\n');
  } catch (error) {
    console.error("[Retrieval] Error fetching RAG context:", error);
    return ''; // Failsafe: return empty context if db/vector fails
  }
}
