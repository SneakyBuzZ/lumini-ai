import { UpsertView } from "../api/dto";
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

export type CanvasCusor = CSSStyleDeclaration["cursor"];

export type CanvasSnapshot = {
  shapes: Record<string, CanvasShape>;
  shapeOrder: string[];
  selectedShapeIds: string[];
};

export type ShapeCommitBatchEvent = {
  type: "shape:commit";
  labId: string;
  authorId: string;
  commits: Array<{
    shapeId: string;
    commitType: "new" | "updated" | "deleted";
    commitVersion: number;
    shape: Partial<CanvasShape>;
  }>;
};

export type ShapeCommit = {
  shapeId: string;
  commitType: "new" | "updated" | "deleted";
  commitVersion: number;
  shape: Partial<CanvasShape>;
};

export type ShapePreviewEvent = {
  type: "shape:preview";
  shapeId: string;
  patch: Partial<CanvasShape>;
  authorId: string;
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

  //* --- Tool Preferences ---
  toolPreferences: {
    strokeColor: string;
    strokeType: "solid" | "dashed" | "dotted";
    strokeWidth: number;
    fillColor: string;
    fontSize: number;
  };

  //* --- Server Sync ---
  hasHydrated: boolean;
  isRestoringFromHistory: boolean;
  previewShapes: Record<string, Partial<CanvasShape>>;
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
    commitShape: (id: string, type?: "new" | "updated" | "deleted") => void;
    applyRemoteShapeCommit: (event: ShapeCommit) => void;
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
    hydrateView: (view: UpsertView) => void;
    reset: () => void;
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

  // --- Tool Preferences ---
  toolPreferencesActions: {
    set: <K extends keyof State["toolPreferences"]>(
      key: K,
      value: State["toolPreferences"][K],
    ) => void;
  };

  // --- Remote Preview ---
  preview: {
    set: (shapeId: string, patch: Partial<CanvasShape>) => void;
    clear: (shapeId: string) => void;
    clearAll: () => void;
  };

  // --- Server Sync ---
  hydrateCanvas: (snapshot: { shapes: Record<string, DBShape> }) => void;
  markAsSynced: (shapeId: string, version: number) => void;
};
