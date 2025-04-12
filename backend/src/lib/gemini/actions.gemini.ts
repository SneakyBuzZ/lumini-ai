import { getFileSummaryPrompt } from "../prompts/file-summary.js";
import { RepoFileType, SummarizedRepoFileType } from "../types/github.types.js";
import { flashModel } from "./config.gemini.js";

export const generateSummary = async (content: string) => {
  const prompt = getFileSummaryPrompt(content);

  const summary = await flashModel.generateContent(prompt);

  return summary.response.candidates[0].content.parts[0].text;
};

export const generateFilesSummary = async (
  files: RepoFileType[]
): Promise<SummarizedRepoFileType[]> => {
  const summarizeFiles = await Promise.all(
    files.map(async (file) => {
      const summary = await generateSummary(file.content);

      return {
        file: file.file,
        content: file.content,
        summary,
      };
    })
  );

  return summarizeFiles;
};
