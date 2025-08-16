import { create } from "zustand";
import { Shape, ShapeType } from "@/lib/types/canvas.type";

type State = {
  shapes: Shape[];
  drawingInProgress: boolean;
  tempShapeId: string | null;
  startX: number;
  startY: number;
  selectedShapeId: string | null;
  currentShape: ShapeType;
  doubleClickLock: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;
};

type Actions = {
  startDrawing: (shape: Shape, startX: number, startY: number) => void;
  updateTempShape: (width: number, height: number) => void;
  finishDrawing: () => void;
  addShape: (shape: Shape) => void;
  updateShape: (shape: Shape) => void;
  deleteShape: (id: string) => void;
  selectShape: (id: string | null) => void;
  setShape: (shape: ShapeType) => void;
  setDoubleClickLock: (lock: boolean) => void;
  reset: () => void;
  setScale: (scale: number) => void;
  setOffset: (x: number, y: number) => void;
};

const initialState: State = {
  shapes: [],
  drawingInProgress: false,
  tempShapeId: null,
  startX: 0,
  startY: 0,
  selectedShapeId: null,
  currentShape: "rectangle",
  doubleClickLock: false,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

const useCanvasStore = create<State & Actions>((set) => ({
  ...initialState,
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (shape) =>
    set((state) => ({
      shapes: state.shapes.map((s) => (s.id === shape.id ? shape : s)),
    })),
  deleteShape: (id) =>
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id),
    })),
  selectShape: (id) => set({ selectedShapeId: id }),
  setShape: (shape) => set({ currentShape: shape }),
  reset: () =>
    set({ shapes: [], selectedShapeId: null, currentShape: "rectangle" }),
  startDrawing: (shape, startX, startY) =>
    set((state) => ({
      shapes: [...state.shapes, shape],
      drawingInProgress: true,
      tempShapeId: shape.id,
      startX,
      startY,
    })),
  updateTempShape: (width, height) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === state.tempShapeId ? { ...s, width, height } : s
      ),
    })),
  finishDrawing: () => set({ drawingInProgress: false, tempShapeId: null }),
  setDoubleClickLock: (lock: boolean) => set({ doubleClickLock: lock }),
  setScale: (scale) => set({ scale }),
  setOffset: (x, y) => set({ offsetX: x, offsetY: y }),
}));

export default useCanvasStore;
