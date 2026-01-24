import { format } from "date-fns";
import {
  CommitType,
  NormalizedLanguage,
  RawLanguages,
  RepoOwnerType,
} from "@/lib/types/github.type";
import { octokit } from "@/lib/config/github-config";

export const parseGitHubUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match || match.length < 3) {
    throw new Error("Invalid GitHub URL");
  }
  return { owner: match[1], repo: match[2] };
};

export const getCommitsByUrl = async (
  githubUrl: string,
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
      }),
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

//^ ------- Basic Info -------
const getRepoInfo = async (owner: string, repo: string) => {
  const result = await octokit.rest.repos.get({
    owner,
    repo,
  });
  const data = {
    fullname: result.data.full_name,
    visibility: result.data.visibility || "public",
    branch: result.data.default_branch,
    sizeKb: result.data.size,
    repoCreatedAt: new Date(result.data.created_at),
  };
  return data;
};

//^------ Languages -------

export const normalizeLanguages = (
  raw: RawLanguages,
): { major: NormalizedLanguage[]; totalBytes: number } => {
  const totalBytes = Object.values(raw).reduce((a, b) => a + b, 0);
  const languages = Object.entries(raw).map(([name, bytes]) => ({
    name,
    percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
  }));
  languages.sort((a, b) => b.percentage - a.percentage);
  const major = languages.filter((lang) => lang.percentage >= 2).slice(0, 4);
  const minor = languages.filter((lang) => lang.percentage < 2);
  if (minor.length) {
    const otherPercentage = minor.reduce((a, b) => a + b.percentage, 0);
    major.push({
      name: "Other",
      percentage: Number(otherPercentage.toFixed(1)),
    });
  }
  return { major, totalBytes };
};

export const getLanguages = async (url: string) => {
  const { owner, repo } = parseGitHubUrl(url);
  const result = await octokit.rest.repos.listLanguages({
    owner,
    repo,
  });
  const { major, totalBytes } = normalizeLanguages(result.data as RawLanguages);
  return { raw: result.data, normalized: major, totalBytes };
};

//^ ------- Tech Stack Detection -------
type DetectTechStackInput = {
  files: string[];
  languages: Record<string, number>;
};

function getTopLevelFolders(files: string[]): Set<string> {
  const folders = new Set<string>();

  for (const file of files) {
    const parts = file.split("/");
    if (parts.length > 1) {
      folders.add(parts[0]);
    }
  }

  return folders;
}

const getTechStack = ({ files, languages }: DetectTechStackInput): string[] => {
  const tech = new Set<string>();

  const topFolders = getTopLevelFolders(files);

  const hasFile = (name: string) => files.some((f) => f.endsWith(name));

  const hasExt = (ext: string) => files.some((f) => f.endsWith(ext));

  const hasPath = (prefix: string) =>
    files.some((f) => f.startsWith(prefix + "/"));

  // Detect React, Next , Vuew , Angular , Svelte
  if (hasFile("next.config.js") || hasFile("next.config.ts")) {
    tech.add("Next.js");
  }

  if (
    (hasPath("src") || hasPath("client") || hasPath("components")) &&
    files.some((f) => f.endsWith(".tsx") || f.endsWith(".jsx"))
  ) {
    tech.add("React.js");
  }

  if (hasFile("vue.config.js") || files.some((f) => f.endsWith(".vue"))) {
    tech.add("Vue.js");
  }

  if (hasFile("angular.json")) {
    tech.add("Angular.js");
  }

  if (hasFile("svelte.config.js") || files.some((f) => f.endsWith(".svelte"))) {
    tech.add("Svelte Kit");
  }

  // Detect Express, NestJS , Django , Flask , Ruby on Rails
  if (hasFile("nest-cli.json")) {
    tech.add("NestJS");
  }

  if (
    (hasPath("server") && hasFile("server/package.json")) ||
    (hasPath("backend") && hasFile("backend/package.json"))
  ) {
    tech.add("Node.js");
    tech.add("Backend");
  }

  if (hasPath("server/src") && hasFile("server/src/index.ts")) {
    tech.add("Express.js");
  }

  // ---------- Styling ----------
  if (hasFile("tailwind.config.js") || hasFile("tailwind.config.ts")) {
    tech.add("Tailwind CSS");
  }

  // Detect Mobile Frameworks: React Native , Flutter , Swift , Kotlin
  if (hasFile("package.json")) {
    const packageJsonContent = files
      .filter((f) => f.endsWith("package.json"))
      .map((f) => f.toLowerCase());
    for (const content of packageJsonContent) {
      if (content.includes("react-native")) tech.add("React Native");
    }
  }
  if (hasExt(".dart")) tech.add("Flutter");
  if (hasExt(".swift")) tech.add("Swift");
  if (hasExt(".kt") || hasExt(".kts")) tech.add("Kotlin");

  // ML and AI Frameworks
  if (languages["Python"] && hasFile("requirements.txt")) {
    const reqContent = files
      .filter((f) => f.endsWith("requirements.txt"))
      .map((f) => f.toLowerCase());
    for (const content of reqContent) {
      if (content.includes("tensorflow")) tech.add("TensorFlow");
      if (content.includes("torch")) tech.add("PyTorch");
      if (content.includes("keras")) tech.add("Keras");
    }
  }

  // Detect Docker , Kubernetes , Terraform , Ansible , CI/CD , GitHub Actions , Jenkins
  if (hasFile("Dockerfile")) tech.add("Docker");
  if (hasFile("docker-compose.yml")) tech.add("Docker Compose");
  if (hasFile("kubernetes.yml") || hasFile("k8s.yml")) tech.add("Kubernetes");
  if (hasFile("terraform.tf")) tech.add("Terraform");
  if (hasFile("ansible.cfg")) tech.add("Ansible");
  if (hasFile(".github/workflows")) tech.add("GitHub Actions");
  if (hasFile("Jenkinsfile")) tech.add("Jenkins");

  // Detect Blockchain Frameworks: Solidity , Hardhat , Truffle , Web3.js , Ethers.js , Solana , Anchor
  if (hasExt(".sol")) tech.add("Solidity");
  if (hasFile("hardhat.config.js") || hasFile("hardhat.config.ts"))
    tech.add("Hardhat");
  if (hasFile("truffle-config.js")) tech.add("Truffle");
  if (hasFile("package.json")) {
    const packageJsonContent = files
      .filter((f) => f.endsWith("package.json"))
      .map((f) => f.toLowerCase());
    for (const content of packageJsonContent) {
      if (content.includes("web3")) tech.add("Web3.js");
      if (content.includes("ethers")) tech.add("Ethers.js");
    }
  }
  if (hasExt(".rs") && hasPath("programs")) tech.add("Solana");
  if (hasFile("Anchor.toml")) tech.add("Anchor");

  // ---------- ML / AI ----------
  if (hasExt(".ipynb")) tech.add("Jupyter NB");
  if (hasFile("requirements.txt")) tech.add("Python ML");
  if (hasFile("environment.yml")) tech.add("Conda");

  if (files.some((f) => f.includes("torch"))) tech.add("PyTorch");
  if (files.some((f) => f.includes("tensorflow"))) tech.add("TensorFlow");
  if (files.some((f) => f.includes("keras"))) tech.add("Keras");

  if (languages["Jupyter Notebook"] && hasPath("models")) tech.add("ML Models");

  // ---------- Repo Shape ----------
  if (topFolders.size > 1) tech.add("Monorepo");

  return Array.from(tech);
};

//^ ------- Tech Stack Detection -------
type ArchitectureStat = {
  name: string;
  percentage: number;
};

const getArchitecture = (tree: any[]): ArchitectureStat[] => {
  const folderCounts: Record<string, number> = {};

  for (const item of tree) {
    if (item.type !== "blob") continue;

    const parts = item.path.split("/");
    if (parts.length < 2) continue;

    const folder = `/${parts[0]}`;
    folderCounts[folder] = (folderCounts[folder] ?? 0) + 1;
  }

  const totalFiles = Object.values(folderCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  if (totalFiles === 0) return [];

  return Object.entries(folderCounts)
    .map(([name, count]) => ({
      name,
      percentage: Number(((count / totalFiles) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // keep UI clean
};

//^ ------- Files , Languages -------
const getFilesAndLanguages = async (
  owner: string,
  repo: string,
  branch: string,
) => {
  const treeResult = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: branch,
    recursive: "true",
  });
  const totalFiles = treeResult.data.tree.length;
  const tree = treeResult.data.tree.map((file) => file.path || "");
  const architecture = getArchitecture(treeResult.data.tree);
  return { totalFiles, architecture, files: tree };
};

//^ ------- Repo Scope Detection -------
const getScope = (paths: string[]): string => {
  const hasPackages = paths.some((p) => p.startsWith("packages/"));
  const hasApps = paths.some((p) => p.startsWith("apps/"));
  const hasWorkspace =
    paths.includes("pnpm-workspace.yaml") ||
    paths.includes("lerna.json") ||
    paths.includes("turbo.json");

  const packageJsonCount = paths.filter((p) =>
    p.endsWith("package.json"),
  ).length;

  if (hasPackages || hasApps || hasWorkspace || packageJsonCount > 1) {
    return "monorepo";
  }

  const hasAppEntrypoint =
    paths.includes("index.html") ||
    paths.some((p) => p.startsWith("public/")) ||
    paths.some((p) => p.startsWith("pages/")) ||
    paths.some((p) => p.startsWith("app/"));

  const hasIndexExport =
    paths.includes("src/index.ts") || paths.includes("src/index.js");

  if (hasIndexExport && !hasAppEntrypoint) {
    return "library";
  }

  if (hasAppEntrypoint) {
    return "application";
  }

  return "mixed";
};

//^------- Last Activity Detection -------
const getLastActivity = async (owner: string, repo: string, branch: string) => {
  const commits = await octokit.rest.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page: 1,
  });
  if (commits.data.length === 0) return null;
  return new Date(commits.data[0].commit.author?.date || "");
};

//^ ------ Summary ------
const buildSummary = async (
  languages: NormalizedLanguage[],
  scope: string,
  techstack: any,
) => {
  let summary = `This is a ${scope} project that primarily uses ${languages.map((lang) => lang.name).join(", ")} languages and includes technologies such as ${techstack.join(", ")}.`;
  return summary;
};

//& ------ Overview Builder ------
export const buildOverview = async (githubUrl: string) => {
  const { owner, repo } = parseGitHubUrl(githubUrl);
  const { fullname, branch, visibility, sizeKb, repoCreatedAt } =
    await getRepoInfo(owner, repo);
  const { raw, normalized, totalBytes } = await getLanguages(githubUrl);
  const { architecture, files, totalFiles } = await getFilesAndLanguages(
    owner,
    repo,
    branch,
  );
  const techStack = getTechStack({ files, languages: raw });

  const scope = getScope(files);

  const lastActivityAt = await getLastActivity(owner, repo, branch);

  const summary = await buildSummary(normalized, scope, techStack);

  return {
    fullname,
    branch,
    visibility,
    techstack: techStack,
    files: totalFiles,
    sizeKb,
    languages: normalized,
    totalBytes,
    architecture,
    scope,
    lastActivityAt,
    repoCreatedAt,
    summary,
  };
};
