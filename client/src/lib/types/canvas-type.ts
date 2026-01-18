import { DBShape, ShapeKind } from "./lab-type";

export type CanvasShape = DBShape & {
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  persistStatus?: "new" | "updated" | "deleted" | "synced";
  commitVersion: number;
  lastPersistedVersion: number;
};

export type DrawOptions = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type CanvasMode = "draw" | "select" | "pan" | "text";

export type CanvasCusor =
  | "default"
  | "grab"
  | "grabbing"
  | "crosshair"
  | "pointer"
  | "nwse-resize"
  | "nesw-resize"
  | "ns-resize"
  | "ew-resize"
  | "text";

export type CanvasSnapshot = {
  shapes: Record<string, CanvasShape>;
  shapeOrder: string[];
  selectedShapeIds: string[];
};

export type State = {
  //* --- Shapes ---
  shapeType: ShapeKind | null;
  shapes: Record<string, CanvasShape>;
  shapeOrder: string[];

  //* --- Drawing ---
  drawingInProgress: boolean;
  tempShapeId: string | null;
  startX: number;
  startY: number;

  //* --- Selection ---
  selectedShapeIds: string[];
  mode: CanvasMode;
  cursor: CanvasCusor;

  //* --- Canvas View ---
  scale: number;
  offsetX: number;
  offsetY: number;
  doubleClickLock: boolean;

  //* --- Panning ---
  panStart: { x: number; y: number } | null;
  panIsActive: boolean;

  //* --- History ---
  history: CanvasSnapshot[];
  redoStack: CanvasSnapshot[];

  //* --- Selection Box ---
  selectionBoxStart: { x: number; y: number } | null;
  selectionBoxEnd: { x: number; y: number } | null;

  //* --- Server Sync ---
  hasHydrated: boolean;
  isRestoringFromHistory: boolean;
};

export type Actions = {
  // --- Drawing Actions ---
  setShapeType: (type: ShapeKind | null) => void;

  drawing: {
    start: (shape: CanvasShape, startX: number, startY: number) => void;
    updateTemp: (width: number, height: number) => void;
    finish: () => void;
  };

  text: {
    updateText: (id: string, newText: string) => void;
    setFontSize: (id: string, newSize: number) => void;
    commitText: (id: string, text: string) => void;
  };

  // --- Shape Management ---
  shapesActions: {
    add: (shape: CanvasShape) => void;
    update: (shape: CanvasShape) => void;
    delete: (id: string) => void;
    remove: (shapeId: string) => void;
    batchUpdate: (shapes: Record<string, Partial<CanvasShape>>) => void;
    batchDelete: (shapes: CanvasShape[]) => void;
    commitShape: (id: string, type?: "new" | "updated") => void;
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

  // --- Server Sync ---
  hydrateCanvas: (snapshot: { shapes: Record<string, DBShape> }) => void;
  markAsSynced: (shapeId: string, version: number) => void;
};
