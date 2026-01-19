import { ShapeBatchOperation } from "../api/dto";
import { CanvasShape } from "../types/canvas-type";
import { toDBShape } from "./utils";

let queued = false;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function scheduleFlush(flush: () => void): void {
  if (!queued) {
    queued = true;
    queueMicrotask(() => {
      queued = false;
      flush();
    });
  }

  if (!timeoutId) {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      flush();
    }, 100);
  }
}

export function shapeToOperation(
  shape: CanvasShape,
): ShapeBatchOperation | null {
  if (shape.persistStatus === "new") {
    return {
      op: "create",
      shapeId: shape.id,
      commitVersion: shape.commitVersion,
      payload: toDBShape(shape),
    };
  }

  if (shape.persistStatus === "updated") {
    return {
      op: "update",
      shapeId: shape.id,
      commitVersion: shape.commitVersion,
      payload: toDBShape(shape),
    };
  }

  if (shape.persistStatus === "deleted") {
    return {
      op: "delete",
      shapeId: shape.id,
      commitVersion: shape.commitVersion,
      payload: null,
    };
  }

  return null;
}

export function stripPersistence(shape: CanvasShape): CanvasShape {
  return {
    ...shape,
    persistStatus: "synced",
    commitVersion: shape.commitVersion,
    lastPersistedVersion: shape.commitVersion,
  };
}
