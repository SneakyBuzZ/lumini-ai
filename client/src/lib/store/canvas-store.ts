import { create } from "zustand";
import {
  CanvasCusor,
  CanvasMode,
  Shape,
  ShapeType,
} from "@/lib/types/canvas-type";

export type State = {
  // --- Shapes ---
  shapeType: ShapeType | null;
  shapes: Record<string, Shape>;
  shapeOrder: string[];

  // --- Drawing ---
  drawingInProgress: boolean;
  tempShapeId: string | null;
  startX: number;
  startY: number;

  // --- Selection ---
  selectedShapeIds: string[];
  mode: CanvasMode;
  cursor: CanvasCusor;

  // --- Canvas View ---
  scale: number;
  offsetX: number;
  offsetY: number;
  doubleClickLock: boolean;

  // --- Panning ---
  panStart: { x: number; y: number } | null;
  panIsActive: boolean;

  // --- History ---
  history: Record<string, Shape>[];
  redoStack: Record<string, Shape>[];

  // --- Selection Box ---
  selectionBoxStart: { x: number; y: number } | null;
  selectionBoxEnd: { x: number; y: number } | null;
};

export type Actions = {
  // --- Drawing Actions ---
  setShapeType: (type: ShapeType | null) => void;

  drawing: {
    start: (shape: Shape, startX: number, startY: number) => void;
    updateTemp: (width: number, height: number) => void;
    finish: () => void;
  };

  // --- Shape Management ---
  shapesActions: {
    add: (shape: Shape) => void;
    update: (shape: Shape) => void;
    delete: (id: string) => void;
    batchUpdate: (shapes: Record<string, Partial<Shape>>) => void;
  };

  // --- Selection ---
  selection: {
    select: (ids: string[] | null) => void;
    addId: (id: string) => void;
    removeId: (id: string) => void;
    clear: () => void;
    move: (id: string, dx: number, dy: number) => void;
    resize: (id: string, newWidth: number, newHeight: number) => void;
    setMode: (mode: CanvasMode) => void;
  };

  // --- Canvas View ---
  view: {
    setScale: (scale: number) => void;
    setOffset: (x: number, y: number) => void;
    setDoubleClickLock: (lock: boolean) => void;
    setCursor: (cursor: CanvasCusor) => void;
  };

  // --- Pan Actions ---
  pan: {
    start: (x: number, y: number) => void;
    move: (x: number, y: number) => void;
    end: () => void;
  };

  // --- History ---
  historyActions: {
    push: () => void;
    undo: () => void;
    redo: () => void;
  };

  // --- Selection Box ---
  selectionBox: {
    start: (x: number, y: number) => void;
    update: (x: number, y: number) => void;
    finish: () => void;
  };
};

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
      get().historyActions.push();
    },
    updateTemp: (width, height) => {
      const tempId = get().tempShapeId;
      if (!tempId) return;
      get().shapesActions.update({ ...get().shapes[tempId], width, height });
    },
    finish: () => set({ drawingInProgress: false, tempShapeId: null }),
  },

  // --- Shape Management ---
  shapesActions: {
    add: (shape) =>
      set((state) => ({
        shapes: { ...state.shapes, [shape.id]: shape },
        shapeOrder: [...state.shapeOrder, shape.id],
      })),
    update: (shape) =>
      set((state) => ({ shapes: { ...state.shapes, [shape.id]: shape } })),
    delete: (id) =>
      set((state) => ({
        shapes: Object.fromEntries(
          Object.entries(state.shapes).filter(([key]) => key !== id)
        ),
        shapeOrder: state.shapeOrder.filter((sid) => sid !== id),
      })),
    batchUpdate: (updates: Record<string, Partial<Shape>>) => {
      set((state) => {
        const newShapes = { ...state.shapes };
        for (const [id, changes] of Object.entries(updates)) {
          newShapes[id] = { ...newShapes[id], ...changes };
        }
        return { shapes: newShapes };
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
            strokeColor: "#d6d6d6",
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
            strokeColor: "#d6d6d6",
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
    setScale: (scale) => set({ scale }),
    setOffset: (x, y) => set({ offsetX: x, offsetY: y }),
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
      const snapshot = { ...get().shapes };
      set((state) => ({
        history: [...state.history, snapshot],
        redoStack: [],
      }));
    },
    undo: () => {
      const history = get().history;
      if (!history.length) return;
      const last = history[history.length - 1];
      set(() => ({
        shapes: last,
        shapeOrder: Object.keys(last),
        history: history.slice(0, -1),
      }));
    },
    redo: () => {
      const redoStack = get().redoStack;
      if (!redoStack.length) return;
      const next = redoStack[redoStack.length - 1];
      set(() => ({
        shapes: next,
        shapeOrder: Object.keys(next),
        redoStack: redoStack.slice(0, -1),
      }));
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
            s.y + s.height <= bottom
        )
        .map((s) => s.id);

      set({ selectedShapeIds: selected });
    },
    finish: () => set({ selectionBoxStart: null, selectionBoxEnd: null }),
  },
}));

export default useCanvasStore;
