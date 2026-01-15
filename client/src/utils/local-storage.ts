import { Actions, State } from "@/lib/store/canvas-store";

const CANVAS_LS_KEY = "lumini/canvas_state";
const RECENT_WORKSPACE_ID_LS_KEY = "lumini/recent_workspace_id";

export const saveCanvasToLocalStorage = (state: State & Actions) => {
  try {
    const data = JSON.stringify({
      shapes: state.shapes,
      shapeOrder: state.shapeOrder,
      selectedShapeIds: state.selectedShapeIds,
      scale: state.scale,
      offsetX: state.offsetX,
      offsetY: state.offsetY,
      mode: state.mode,
    });
    localStorage.setItem(CANVAS_LS_KEY, data);
  } catch (err) {
    console.error("Failed to save canvas to localStorage:", err);
  }
};

export const loadCanvasFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(CANVAS_LS_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to load canvas from localStorage:", err);
    return null;
  }
};

export const loadRecentWorkspaceId = () => {
  return localStorage.getItem(RECENT_WORKSPACE_ID_LS_KEY);
};
