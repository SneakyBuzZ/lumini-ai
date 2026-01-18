import { createShape, deleteShape, updateShape } from "@/lib/api/lab-api";
import useCanvasStore from "@/lib/store/canvas-store";
import { useEffect, useRef } from "react";

export default function useCanvasPersistence(labId: string) {
  const isPersistingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = useCanvasStore.subscribe(async (state) => {
      if (isPersistingRef.current) return;

      const shapes = Object.values(state.shapes);
      for (const shape of shapes) {
        if (shape.commitVersion <= shape.lastPersistedVersion) continue;

        try {
          isPersistingRef.current = true;

          if (
            shape.persistStatus === "new" &&
            !useCanvasStore.getState().drawingInProgress
          ) {
            await createShape(labId, shape);
          }

          if (shape.persistStatus === "updated") {
            await updateShape(labId, shape.id, shape);
          }

          if (shape.persistStatus === "deleted") {
            await deleteShape(labId, shape.id);
            useCanvasStore.getState().shapesActions.remove(shape.id);
          }

          useCanvasStore.getState().markAsSynced(shape.id, shape.commitVersion);
        } catch (error) {
          console.error("Error persisting shape: ", error);
        } finally {
          isPersistingRef.current = false;
        }
      }
    });

    return unsubscribe;
  }, [labId]);
}
