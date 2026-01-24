type Cursor = {
  x: number;
  y: number;
};

type CursorEvent =
  | {
      type: "cursor:move";
      userId: string;
      x: number;
      y: number;
    }
  | {
      type: "cursor:leave";
      userId: string;
    };

const cursors = new Map<string, Cursor>();

export function handleCursorEvent(event: CursorEvent) {
  if (event.type === "cursor:move") {
    cursors.set(event.userId, {
      x: event.x,
      y: event.y,
    });
  }

  if (event.type === "cursor:leave") {
    cursors.delete(event.userId);
  }
}

export function getCursorsSnapshot() {
  return new Map(cursors);
}

export const CURSORS = {
  default: "default",

  select: "url('/assets/images/lumini-cursor.png') 2 2, auto",
  resizeEW: "url('/assets/images/lumini-resize-ew.png') 10 10, auto",
  resizeNS: "url('/assets/images/lumini-resize-ns.png') 10 10, auto",
  resizeNWSE: "url('/assets/images/lumini-resize-nwse.png') 10 10, auto",
  resizeNESW: "url('/assets/images/lumini-resize-nesw.png') 10 10, auto",

  lineEndpoint: "url('/assets/images/lumini-line-endpoint.png') 6 6, auto",
} as const;
