import { create } from "zustand";
import {
  CanvasShape,
  Actions,
  State,
  CanvasSnapshot,
} from "@/lib/types/canvas-type";

const HISTORY_LIMIT = 10;

const initialState: State = {
  shapeType: null,
  shapes: {},
  shapeOrder: [],
  drawingInProgress: false,
  tempShapeId: null,
  startX: 0,
  startY: 0,
  selectedShapeIds: [],
  mode: "select",
  cursor: "default",
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  doubleClickLock: false,
  panStart: null,
  panIsActive: false,
  history: [],
  redoStack: [],
  selectionBoxStart: null,
  selectionBoxEnd: null,
  hasHydrated: false,
};

const useCanvasStore = create<State & Actions>((set, get) => ({
  ...initialState,

  // --- Drawing ---
  setShapeType: (type) => set({ shapeType: type }),

  drawing: {
    start: (shape, startX, startY) => {
      set((state) => ({
        shapes: { ...state.shapes, [shape.id]: shape },
        shapeOrder: [...state.shapeOrder, shape.id],
        drawingInProgress: true,
        tempShapeId: shape.id,
        startX,
        startY,
      }));
    },
    updateTemp: (width, height) => {
      const tempId = get().tempShapeId;
      if (!tempId) return;
      get().shapesActions.update({
        ...get().shapes[tempId],
        width,
        height,
      });
    },
    finish: () => {
      const id = get().tempShapeId;

      set(() => ({
        drawingInProgress: false,
        tempShapeId: null,
      }));

      if (id) get().shapesActions.commitShape(id, "new");
    },
  },

  text: {
    updateText: (id, newText) => {
      const shape = get().shapes[id];
      if (!shape) return;
      get().shapesActions.update({ ...shape, text: newText });
    },
    setFontSize: (id, newSize) => {
      const shape = get().shapes[id];
      if (!shape) return;
      get().shapesActions.update({ ...shape, fontSize: newSize });
    },
    commitText: (id, text) => {
      set((state) => {
        const shape = state.shapes[id];
        if (!shape) return state;

        return {
          shapes: {
            ...state.shapes,
            [id]: {
              ...shape,
              text,
              commitVersion: shape.commitVersion + 1,
              persistStatus: shape.persistStatus === "new" ? "new" : "updated",
            },
          },
        };
      });
    },
  },

  // --- Shape Management ---
  shapesActions: {
    add: (shape) => {
      set((state) => {
        const newState = {
          shapes: { ...state.shapes, [shape.id]: shape },
          shapeOrder: [...state.shapeOrder, shape.id],
        };
        return newState;
      });
    },
    update: (shape) => {
      set((state) => ({
        shapes: {
          ...state.shapes,
          [shape.id]: shape,
        },
      }));
    },
    delete: (id) => {
      set((state) => ({
        shapes: {
          ...state.shapes,
          [id]: {
            ...state.shapes[id],
            persistStatus: "deleted",
          },
        },
      }));
    },
    remove: (shapeId) => {
      set((state) => {
        const newShapes = { ...state.shapes };
        delete newShapes[shapeId];
        return {
          shapes: newShapes,
          shapeOrder: state.shapeOrder.filter((id) => id !== shapeId),
        };
      });
    },
    batchUpdate: (updates) => {
      set((state) => {
        const newShapes = { ...state.shapes };
        for (const [id, changes] of Object.entries(updates)) {
          newShapes[id] = { ...newShapes[id], ...changes };
        }
        const newState = { shapes: newShapes };
        return newState;
      });
    },
    batchDelete: (shapes: CanvasShape[]) => {
      set((state) => {
        const idsToDelete = new Set(shapes.map((s) => s.id));
        const newShapes = Object.fromEntries(
          Object.entries(state.shapes).filter(([key]) => !idsToDelete.has(key)),
        );
        return {
          shapes: newShapes,
          shapeOrder: state.shapeOrder.filter((sid) => !idsToDelete.has(sid)),
        };
      });
    },
    clearSelectedShapes: () => {
      set((state) => {
        const newShapes = { ...state.shapes };
        state.selectedShapeIds.forEach((id) => {
          if (newShapes[id]) {
            newShapes[id] = {
              ...newShapes[id],
              isSelected: false,
            };
          }
        });
        return { shapes: newShapes, selectedShapeIds: [] };
      });
    },
    commitShape: (id, type = "updated") => {
      set((state) => {
        const shape = state.shapes[id];
        if (!shape) return state;

        return {
          shapes: {
            ...state.shapes,
            [id]: {
              ...shape,
              commitVersion: shape.commitVersion + 1,
              persistStatus: shape.persistStatus === "new" ? "new" : type,
            },
          },
        };
      });
    },
  },

  // --- Selection ---
  selection: {
    select: (ids) => set({ selectedShapeIds: ids ?? [] }),
    addId: (id) =>
      set((state) => {
        const shape = state.shapes[id];
        if (shape)
          state.shapes[id] = {
            ...shape,
            isSelected: true,
          };
        const newSelected = state.selectedShapeIds.includes(id)
          ? state.selectedShapeIds
          : [...state.selectedShapeIds, id];
        return { shapes: { ...state.shapes }, selectedShapeIds: newSelected };
      }),
    removeId: (id) =>
      set((state) => {
        const shape = state.shapes[id];
        if (shape)
          state.shapes[id] = {
            ...shape,
            isSelected: false,
          };
        return {
          shapes: { ...state.shapes },
          selectedShapeIds: state.selectedShapeIds.filter((s) => s !== id),
        };
      }),
    clear: () =>
      set((state) => {
        state.selectedShapeIds.forEach((id) => {
          const shape = state.shapes[id];
          if (shape) shape.isSelected = false;
        });
        return { selectedShapeIds: [] };
      }),
    move: (id, dx, dy) => {
      const shape = get().shapes[id];
      if (!shape) return;
      get().shapesActions.update({
        ...shape,
        x: shape.x + dx,
        y: shape.y + dy,
      });
    },
    resize: (id, newWidth, newHeight) => {
      const shape = get().shapes[id];
      if (!shape) return;
      get().shapesActions.update({
        ...shape,
        width: newWidth,
        height: newHeight,
      });
    },
    setMode: (mode) => set({ mode }),
  },

  // --- Canvas View ---
  view: {
    setScale: (scale) => {
      set(() => {
        const newState = { scale };
        return newState;
      });
    },
    setOffset: (x, y) => {
      set(() => {
        const newState = { offsetX: x, offsetY: y };
        return newState;
      });
    },
    setDoubleClickLock: (lock) => set({ doubleClickLock: lock }),
    setCursor: (cursor) => set({ cursor }),
  },

  // --- Pan ---
  pan: {
    start: (x, y) => set({ panStart: { x, y }, panIsActive: true }),
    move: (x, y) => {
      const state = get();
      if (!state.panIsActive || !state.panStart) return;
      const dx = x - state.panStart.x;
      const dy = y - state.panStart.y;
      set({
        offsetX: state.offsetX + dx,
        offsetY: state.offsetY + dy,
        panStart: { x, y },
      });
    },
    end: () => set({ panStart: null, panIsActive: false }),
  },

  // --- History ---
  historyActions: {
    push: () => {
      const state = get();
      const snapshot: CanvasSnapshot = {
        shapes: structuredClone(state.shapes),
        shapeOrder: [...state.shapeOrder],
        selectedShapeIds: [...state.selectedShapeIds],
      };
      set({
        history: [...state.history, snapshot].slice(-HISTORY_LIMIT),
        redoStack: [],
      });
    },

    undo: () => {
      const { history, redoStack } = get();
      if (!history.length) return;

      const lastSnapshot = history[history.length - 1];

      set({
        shapes: structuredClone(lastSnapshot.shapes),
        shapeOrder: [...lastSnapshot.shapeOrder],
        selectedShapeIds: [...lastSnapshot.selectedShapeIds],
        history: history.slice(0, -1),
        redoStack: [...redoStack, lastSnapshot],
      });
    },

    redo: () => {
      const { redoStack, history } = get();
      if (!redoStack.length) return;

      const nextSnapshot = redoStack[redoStack.length - 1];

      set({
        shapes: structuredClone(nextSnapshot.shapes),
        shapeOrder: [...nextSnapshot.shapeOrder],
        selectedShapeIds: [...nextSnapshot.selectedShapeIds],
        redoStack: redoStack.slice(0, -1),
        history: [...history, nextSnapshot],
      });
    },
  },

  // --- Selection Box ---
  selectionBox: {
    start: (x, y) =>
      set({ selectionBoxStart: { x, y }, selectionBoxEnd: { x, y } }),
    update: (x, y) => {
      set({ selectionBoxEnd: { x, y } });
      const { selectionBoxStart, shapes } = get();
      if (!selectionBoxStart) return;

      const left = Math.min(selectionBoxStart.x, x);
      const top = Math.min(selectionBoxStart.y, y);
      const right = Math.max(selectionBoxStart.x, x);
      const bottom = Math.max(selectionBoxStart.y, y);

      const selected = Object.values(shapes)
        .filter(
          (s) =>
            s.x >= left &&
            s.y >= top &&
            s.x + s.width <= right &&
            s.y + s.height <= bottom,
        )
        .map((s) => s.id);

      set({ selectedShapeIds: selected });
    },
    finish: () => set({ selectionBoxStart: null, selectionBoxEnd: null }),
  },

  // --- Server Sync ---
  hydrateCanvas: (snapshot) => {
    set((state) => {
      if (state.hasHydrated) return state;

      const shapes: Record<string, CanvasShape> = {};

      for (const [id, shape] of Object.entries(snapshot.shapes)) {
        if (shape.isDeleted) continue;
        if (shape.width <= 0 || shape.height <= 0) continue;

        shapes[id] = {
          ...shape,
          isSelected: false,
          isHovered: false,
          isDragging: false,
          persistStatus: "synced",
          commitVersion: shape.version,
          lastPersistedVersion: shape.version,
        };
      }

      return {
        shapes: shapes,
        shapeOrder: Object.values(shapes)
          .sort((a, b) =>
            a.zIndex === b.zIndex
              ? a.id.localeCompare(b.id)
              : a.zIndex - b.zIndex,
          )
          .map((s) => s.id),
        selectedShapeIds: [],
        history: [],
        redoStack: [],
        hasHydrated: true,
      };
    });
  },

  markAsSynced: (shapeId, version) => {
    set((state) => ({
      shapes: {
        ...state.shapes,
        [shapeId]: {
          ...state.shapes[shapeId],
          persistStatus: "synced",
          lastPersistedVersion: version,
        },
      },
    }));
  },
}));

export default useCanvasStore;
