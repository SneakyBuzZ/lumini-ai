import { Document } from "@langchain/core/documents";
import { SummarizedRepoFileType } from "../types/github.types.js";
import { chroma, embeddings } from "./config.chroma.js";
import { flashModel } from "../gemini/config.gemini.js";
import { v4 as uuidv4 } from "uuid";
import { getAskRepoPrompt } from "../prompts/ask-repo.js";

export async function storeEmbeddings(
  repoFiles: SummarizedRepoFileType[],
  projectId: string
) {
  const documents = repoFiles.map(
    (file) =>
      new Document({
        pageContent: `${file.content}\n\nSummary: ${file.summary}`,
        metadata: {
          projectId: projectId,
          file: file.file,
          summary: file.summary,
        },
      })
  );

  const documentIds = documents.map(() => uuidv4());

  const documentEmbeddings = await embeddings.embedDocuments(
    documents.map((doc) => doc.pageContent)
  );

  await chroma.addVectors(documentEmbeddings, documents, {
    ids: documentIds,
  });
}

export async function findSimilarDocuments(query: string) {
  const queryEmbedding = await embeddings.embedQuery(query);

  const results = await chroma.similaritySearchVectorWithScore(
    queryEmbedding,
    2
  );

  console.log("Similar documents:", results);
  return results;
}

export async function askGeminiWithContext(
  question: string,
  projectId: string
) {
  const queryEmbedding = await embeddings.embedQuery(question);

  const results = (
    await chroma.similaritySearchVectorWithScore(queryEmbedding, 10)
  ).filter(([doc]) => doc.metadata.projectId === projectId);

  if (results.length === 0) {
    console.log("No relevant files found.");
    return;
  }

  const relatedFiles = results.map(([doc]) => doc.metadata.file);
  const context = results
    .map(
      ([doc]) =>
        `File: ${doc.metadata.file}\nSummary: ${doc.metadata.summary}\nContent:\n${doc.pageContent}`
    )
    .join("\n\n---\n\n");

  const prompt = getAskRepoPrompt(question, relatedFiles, context);

  const result = await flashModel.generateContent(prompt);

  if (!result.response || !result.response.candidates) {
    return;
  }

  const answer = result.response.candidates[0].content.parts[0].text;

  const related = results.map(([doc]) => ({
    file: doc.metadata.file,
    summary: doc.metadata.summary,
    content: doc.pageContent,
  }));

  return {
    relatedFiles: related,
    answer,
  };
}
