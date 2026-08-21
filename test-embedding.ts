import { getEmbedding } from './backend/server/ai/gemini';

async function main() {
  try {
    const embedding = await getEmbedding("Hello, this is a test.");
    console.log(`Embedding generated successfully! Dimension: ${embedding.length}`);
  } catch (err) {
    console.error("Error generating embedding:", err);
  }
}

main();
