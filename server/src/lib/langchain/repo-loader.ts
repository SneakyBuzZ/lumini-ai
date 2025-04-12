import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { RepoFileType } from "@/lib/types/github.type";

export async function loadGitHubRepo(url: string): Promise<RepoFileType[]> {
  const loader = new GithubRepoLoader(url, {
    branch: "main",
    recursive: true,
    ignoreFiles: ["node_modules", "dist", ".git"],
    accessToken: process.env.GITHUB_TOKEN!,
  });

  const docs = await loader.load();

  return docs.map((doc) => {
    return {
      file: doc.metadata.source,
      content: doc.pageContent,
    };
  });
}
