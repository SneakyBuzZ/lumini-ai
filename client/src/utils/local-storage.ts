const RECENT_WORKSPACE_ID_LS_KEY = "lumini/recent_workspace_id";

export const loadRecentWorkspaceId = () => {
  return localStorage.getItem(RECENT_WORKSPACE_ID_LS_KEY);
};
