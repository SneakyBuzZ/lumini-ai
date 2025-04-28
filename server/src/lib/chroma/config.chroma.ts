import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Embeddings } from "@langchain/core/embeddings";
import { embeddingModel } from "@/lib/gemini/config.gemini.js";

class GeminiEmbeddings extends Embeddings {
  constructor(params?: object) {
    if (!params) {
      params = {
        model: "text-embedding-004",
      };
    }
    super(params);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const { embedding } = await embeddingModel.embedContent(text);
        return embedding.values;
      })
    );
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const { embedding } = await embeddingModel.embedContent(text);
    return embedding.values;
  }
}

export const embeddings = new GeminiEmbeddings();

export const chroma = new Chroma(embeddings, {
  collectionName: "lumini-files-summary",
  url: "http://localhost:8000",
});
