import { create } from "zustand";
import { CanvasMode, Shape, ShapeType } from "@/lib/types/canvas-type";

export type State = {
  // --- Shapes ---\
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

  // --- Canvas View ---
  scale: number;
  offsetX: number;
  offsetY: number;
  doubleClickLock: boolean;

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
  };

  // --- Selection Actions ---
  selection: {
    select: (ids: string[]) => void;
    addId: (id: string) => void;
    clear: () => void;
    move: (id: string, dx: number, dy: number) => void;
    resize: (id: string, newWidth: number, newHeight: number) => void;
    setMode: (mode: CanvasMode) => void;
  };

  // --- Canvas View Actions ---
  view: {
    setScale: (scale: number) => void;
    setOffset: (x: number, y: number) => void;
    setDoubleClickLock: (lock: boolean) => void;
  };

  // --- History Actions ---
  historyActions: {
    push: () => void;
    undo: () => void;
    redo: () => void;
  };

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
  drawingInProgress: true,
  tempShapeId: null,
  startX: 0,
  startY: 0,
  selectedShapeIds: [],
  mode: "select",
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  doubleClickLock: false,
  history: [],
  redoStack: [],
  selectionBoxStart: null,
  selectionBoxEnd: null,
};

const useCanvasStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setShapeType: (type) => set({ shapeType: type }),

  // --- Drawing Actions ---
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
      set((state) => ({
        shapes: { ...state.shapes, [shape.id]: shape },
      })),
    delete: (id) =>
      set((state) => ({
        shapes: Object.fromEntries(
          Object.entries(state.shapes).filter(([key]) => key !== id)
        ),
        shapeOrder: state.shapeOrder.filter((sid) => sid !== id),
      })),
  },

  // --- Selection Actions ---
  selection: {
    select: (ids: string[] | null) => set({ selectedShapeIds: ids ?? [] }),
    addId: (id) =>
      set((state) => {
        const shape = state.shapes[id];
        if (shape) {
          console.log("ADDING ID INSIDE", id.slice(0, 6));
          state.shapes[id] = {
            ...shape,
            isSelected: true,
            strokeColor: "#a8a8a8ff",
          };
        }

        const newSelected = state.selectedShapeIds.includes(id)
          ? state.selectedShapeIds
          : [...state.selectedShapeIds, id];

        return {
          shapes: { ...state.shapes },
          selectedShapeIds: newSelected,
        };
      }),
    clear: () =>
      set((state) => {
        console.log("STATE KA SELECTED: ", state.selectedShapeIds);
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

  // --- Canvas View Actions ---
  view: {
    setScale: (scale) => set({ scale }),
    setOffset: (x, y) => set({ offsetX: x, offsetY: y }),
    setDoubleClickLock: (lock) => set({ doubleClickLock: lock }),
  },

  // --- History Actions ---
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
        history: history.slice(0, history.length - 1),
      }));
    },
    redo: () => {
      const redoStack = get().redoStack;
      if (!redoStack.length) return;
      const next = redoStack[redoStack.length - 1];
      set(() => ({
        shapes: next,
        shapeOrder: Object.keys(next),
        redoStack: redoStack.slice(0, redoStack.length - 1),
      }));
    },
  },

  // --- Selection Box Actions ---
  selectionBox: {
    start: (x: number, y: number) => {
      set({ selectionBoxStart: { x, y }, selectionBoxEnd: { x, y } });
    },
    update: (x: number, y: number) => {
      set({ selectionBoxEnd: { x, y } });

      const { selectionBoxStart, shapes } = get();
      if (!selectionBoxStart) return;
      const [x1, y1] = [selectionBoxStart.x, selectionBoxStart.y];
      const [x2, y2] = [x, y];
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      const right = Math.max(x1, x2);
      const bottom = Math.max(y1, y2);

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
    finish: () => {
      set({ selectionBoxStart: null, selectionBoxEnd: null });
    },
  },
}));

export default useCanvasStore;
