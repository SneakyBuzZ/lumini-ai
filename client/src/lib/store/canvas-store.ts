import { create } from "zustand";
import {
  CanvasShape,
  Actions,
  State,
  CanvasSnapshot,
} from "@/lib/types/canvas-type";
import { subscribeWithSelector } from "zustand/middleware";
import { stripPersistence } from "../canvas/persistence";

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
  isRestoringFromHistory: false,
};

const useCanvasStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // --- Drawing ---
    setShapeType: (type) => set({ shapeType: type }),

    drawing: {
      start: (shape, startX, startY) => {
        if (!get().hasHydrated) return;

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
                persistStatus:
                  shape.persistStatus === "new" ? "new" : "updated",
              },
            },
          };
        });
      },
    },

    // --- Shape Management ---
    shapesActions: {
      add: (shape) =>
        set((state) => ({
          shapes: { ...state.shapes, [shape.id]: shape },
          shapeOrder: [...state.shapeOrder, shape.id],
        })),
      update: (shape) =>
        set((state) => ({
          shapes: { ...state.shapes, [shape.id]: shape },
        })),
      delete: (id) => {
        set((state) => {
          const shape = state.shapes[id];
          if (!shape) return state;
          return {
            shapes: {
              ...state.shapes,
              [id]: {
                ...shape,
                isDeleted: true,
                persistStatus: "deleted",
                commitVersion: shape.commitVersion + 1,
              },
            },
          };
        });
      },
      remove: (shapeId) => {
        set((state) => {
          const shape = state.shapes[shapeId];
          if (!shape || shape.persistStatus !== "synced") return state;

          const newShapes = { ...state.shapes };
          delete newShapes[shapeId];

          return {
            shapes: newShapes,
            shapeOrder: state.shapeOrder.filter((id) => id !== shapeId),
          };
        });
      },
      batchUpdate: (updates) =>
        set((state) => {
          const newShapes = { ...state.shapes };
          for (const [id, changes] of Object.entries(updates)) {
            newShapes[id] = { ...newShapes[id], ...changes };
          }
          const newState = { shapes: newShapes };
          return newState;
        }),
      batchDelete: (shapes: CanvasShape[]) => {
        set((state) => {
          const newShapes = { ...state.shapes };

          for (const shape of shapes) {
            const s = newShapes[shape.id];
            if (!s) continue;

            newShapes[shape.id] = {
              ...s,
              isDeleted: true,
              persistStatus: "deleted",
              commitVersion: s.commitVersion + 1,
            };
          }

          return { shapes: newShapes };
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
        set((state) => ({
          selectedShapeIds: state.selectedShapeIds.includes(id)
            ? state.selectedShapeIds
            : [...state.selectedShapeIds, id],
        })),
      removeId: (id) =>
        set((state) => ({
          selectedShapeIds: state.selectedShapeIds.filter((s) => s !== id),
        })),
      clear: () => set({ selectedShapeIds: [] }),
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
      setScale: (scale) => set({ scale }),
      setOffset: (x, y) => set({ offsetX: x, offsetY: y }),
      setDoubleClickLock: (lock) => set({ doubleClickLock: lock }),
      setCursor: (cursor) => set({ cursor }),
      hydrateView: (view) =>
        set({
          scale: view.scale,
          offsetX: view.offsetX,
          offsetY: view.offsetY,
        }),
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
          shapes: Object.fromEntries(
            Object.entries(state.shapes).map(([id, shape]) => [
              id,
              stripPersistence(shape),
            ]),
          ),
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
        const currentShapes = get().shapes;
        const restoredShapes = structuredClone(lastSnapshot.shapes);

        for (const [id, restored] of Object.entries(restoredShapes)) {
          const current = currentShapes[id];
          if (!current) continue;

          // Shape was deleted and is now being restored by undo
          if (current.isDeleted && !restored.isDeleted) {
            restoredShapes[id] = {
              ...restored,
              persistStatus: "updated",
              commitVersion: current.commitVersion + 1,
            };
            continue;
          }

          // 🔁 undo geometry/content changes
          if (
            !current.isDeleted &&
            !restored.isDeleted &&
            (current.x !== restored.x ||
              current.y !== restored.y ||
              current.width !== restored.width ||
              current.height !== restored.height ||
              current.text !== restored.text)
          ) {
            restoredShapes[id] = {
              ...restored,
              persistStatus: "updated",
              commitVersion: current.commitVersion + 1,
            };
          }
        }

        set({ isRestoringFromHistory: true });
        set({
          shapes: restoredShapes,
          shapeOrder: [...lastSnapshot.shapeOrder],
          selectedShapeIds: [...lastSnapshot.selectedShapeIds],
          history: history.slice(0, -1),
          redoStack: [...redoStack, lastSnapshot],
        });
        set({ isRestoringFromHistory: false });
      },

      redo: () => {
        const { redoStack, history } = get();
        if (!redoStack.length) return;

        const nextSnapshot = redoStack[redoStack.length - 1];

        const currentShapes = get().shapes;
        const restoredShapes = structuredClone(nextSnapshot.shapes);

        for (const [id, restored] of Object.entries(restoredShapes)) {
          const current = currentShapes[id];

          if (!current) continue;

          // 🔁 redo restore (was deleted → restored)
          if (current.isDeleted && !restored.isDeleted) {
            restoredShapes[id] = {
              ...restored,
              persistStatus: "updated",
              commitVersion: current.commitVersion + 1,
            };
            continue;
          }

          // 🔁 redo delete (was restored → deleted)
          if (!current.isDeleted && restored.isDeleted) {
            restoredShapes[id] = {
              ...restored,
              persistStatus: "deleted",
              commitVersion: current.commitVersion + 1,
            };
            continue;
          }

          // 🔁 redo geometry/content changes
          if (
            !current.isDeleted &&
            !restored.isDeleted &&
            (current.x !== restored.x ||
              current.y !== restored.y ||
              current.width !== restored.width ||
              current.height !== restored.height ||
              current.text !== restored.text)
          ) {
            restoredShapes[id] = {
              ...restored,
              persistStatus: "updated",
              commitVersion: current.commitVersion + 1,
            };
          }
        }

        set({ isRestoringFromHistory: true });
        set({
          shapes: restoredShapes,
          shapeOrder: [...nextSnapshot.shapeOrder],
          selectedShapeIds: [...nextSnapshot.selectedShapeIds],
          redoStack: redoStack.slice(0, -1),
          history: [...history, nextSnapshot],
        });
        set({ isRestoringFromHistory: false });
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
  })),
);

export default useCanvasStore;
