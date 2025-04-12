import { format } from "date-fns";
import { CommitType, RepoOwnerType } from "../types/github.types.js";
import { octokit } from "./config.github.js";

const parseGitHubUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match || match.length < 3) {
    throw new Error("Invalid GitHub URL");
  }
  return { owner: match[1], repo: match[2] };
};

export const getCommitsByUrl = async (
  githubUrl: string
): Promise<CommitType[]> => {
  try {
    const { owner, repo } = parseGitHubUrl(githubUrl);

    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 3,
    });

    const commits = await Promise.all(
      response.data.map(async (each) => {
        return {
          sha: each.sha,
          message: each.commit.message,
          author: {
            name: each.author?.name || "Unknown",
            avatar: each.author?.avatar_url || "",
            url: each.author?.html_url || "",
          },
          url: each.html_url,
          date: format(new Date(each.commit.author?.date || ""), "PPpp"),
        };
      })
    );

    return commits;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSummarizedCommits = async (commits: CommitType[]) => {
  //   return await Promise.all(commits.map(generateSummaryForCommit));
};

export const fetchUserDetails = async (url: string): Promise<RepoOwnerType> => {
  const { owner } = parseGitHubUrl(url);
  const { data } = await octokit.users.getByUsername({ username: owner });
  return {
    avatar: data.avatar_url,
    name: data.name || "",
    bio: data.bio || "",
    followers: data.followers,
    following: data.following,
    location: data.location || "",
    publicRepos: data.public_repos,
  };
};
