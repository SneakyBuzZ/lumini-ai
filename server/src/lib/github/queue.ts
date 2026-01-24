const runningJobs = new Set<string>();

export function enqueueRefreshRepoOverview(
  labId: string,
  refreshRepoOverview: (labId: string) => Promise<void>,
) {
  if (runningJobs.has(labId)) return;

  runningJobs.add(labId);

  setTimeout(async () => {
    try {
      await refreshRepoOverview(labId);
    } finally {
      runningJobs.delete(labId);
    }
  }, 0);
}
