import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');
import { ingestDocument } from '../server/rag/ingestion';
import { prisma } from '../../database/prisma';

async function main() {
  const kbDir = path.join(__dirname, '../../RagModel/Knowledge_base');
  
  if (!fs.existsSync(kbDir)) {
    console.error(`Knowledge base directory not found at: ${kbDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.pdf'));
  
  if (files.length === 0) {
    console.log("No PDF files found to ingest.");
    return;
  }
  
  console.log(`Found ${files.length} PDF files for ingestion.`);

  // To prevent duplicates, we can check if documents from this source already exist.
  for (const file of files) {
    const sourceName = `pdf_kb_${file}`;
    
    try {
      // Check if already ingested
      const existing = await prisma.$queryRawUnsafe<any[]>(
        `SELECT id FROM "RagDocument" WHERE source = $1 LIMIT 1`,
        sourceName
      );
      
      if (existing && existing.length > 0) {
        console.log(`[Skip] Document already ingested: ${file}`);
        continue;
      }
      
      console.log(`[Processing] ${file}...`);
      const filePath = path.join(kbDir, file);
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdf(dataBuffer);
      
      if (parsed.text) {
        await ingestDocument(parsed.text, sourceName, { filename: file, pages: parsed.numpages });
      } else {
        console.warn(`[Warning] No text extracted from ${file}`);
      }
    } catch (e) {
      console.error(`[Error] Failed to process ${file}:`, e);
    }
  }
  
  console.log("Ingestion process completed.");
  process.exit(0);
}

main().catch(e => {
  console.error("Fatal error during ingestion:", e);
  process.exit(1);
});
