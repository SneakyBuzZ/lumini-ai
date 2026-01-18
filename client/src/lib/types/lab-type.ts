export type LabWithMembers = {
  id: string;
  name: string;
  githubUrl: string;
  creator: {
    name: string;
    image: string;
  };
  workspace: {
    id: string;
    name: string;
  };
  createdAt: string;
};

export type Lab = {
  id: string;
  name: string;
  githubUrl: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    image: string | null;
    name: string;
    email: string;
    createdAt: string;
  };
};

export type LabTable = {
  name: string;
  githubUrl: string;
  creator: {
    id: string;
    image: string | null;
    name: string;
    email: string;
    createdAt: string;
  };
  createdAt: string;
};

export type LabChat = {
  id: string;
  userId: string | null;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type DBShape = {
  id: string;

  // -- Geometry --
  type: ShapeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  // -- Style --
  strokeType: StrokeType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;

  // -- Text --
  text?: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: FontWeight;
  textAlign: TextAlign;

  // -- Layering --
  zIndex: number;

  // -- Flags --
  isLocked: boolean;
  isHidden: boolean;
  isDeleted: boolean;

  // -- Sync Metadata --
  version: number;
};

export type ShapeKind =
  | "rectangle"
  | "ellipse"
  | "line"
  | "arrow"
  | "text"
  | "image";

export type StrokeType = "solid" | "dashed" | "dotted";
export type FontWeight = "normal" | "bold";
export type TextAlign = "left" | "center" | "right";
