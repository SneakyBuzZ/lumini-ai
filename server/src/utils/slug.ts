const fancyNames1 = [
  "calm",
  "vivid",
  "swift",
  "pure",
  "bold",
  "wise",
  "new",
  "clean",
  "fast",
  "quick",
  "light",
  "solid",
  "deep",
  "sharp",
  "true",
  "zen",
  "open",
  "live",
  "soft",
  "bright",
  "great",
  "fresh",
  "cool",
  "neat",
  "prime",
  "final",
  "smart",
  "brave",
  "main",
];

const fancyNames2 = [
  "bonus",
  "logic",
  "code",
  "pixel",
  "byte",
  "wire",
  "node",
  "cache",
  "flow",
  "query",
  "link",
  "sync",
  "dive",
  "shell",
  "task",
  "zone",
  "loop",
  "step",
  "source",
  "bug",
  "goal",
  "fork",
  "clone",
  "net",
  "path",
  "form",
  "sort",
  "branch",
  "mind",
];

export function getSlug() {
  const randomName1 =
    fancyNames1[Math.floor(Math.random() * fancyNames1.length)];
  const randomName2 =
    fancyNames2[Math.floor(Math.random() * fancyNames2.length)];
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `${randomName1}-${randomName2}-${randomNumber}`;
}
