import { BatchUpdateShapes } from "@/lib/api/dto";
import { batchUpdateShapes } from "@/lib/api/lab-api";
import { scheduleFlush, shapeToOperation } from "@/lib/canvas/persistence";
import useCanvasStore from "@/lib/store/canvas-store";
import { Actions, State } from "@/lib/types/canvas-type";
import { useCallback, useEffect, useRef } from "react";

const selectCommitSignal = (state: State & Actions) => {
  return Object.values(state.shapes)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((s) => `${s.id}:${s.commitVersion}:${s.lastPersistedVersion}`)
    .join("|");
};

export default function useCanvasPersistence(labSlug: string) {
  const isPersistingRef = useRef(false);
  const lastFlushedSignatureRef = useRef<string | null>(null);

  const flush = useCallback(async () => {
    if (isPersistingRef.current) return;

    const store = useCanvasStore.getState();
    if (store.drawingInProgress || store.isRestoringFromHistory) return;

    const shapes = Object.values(store.shapes);

    const pending = shapes.filter(
      (s) => s.commitVersion > s.lastPersistedVersion,
    );
    if (pending.length === 0) return;

    const signature = pending
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((s) => `${s.id}:${s.commitVersion}`)
      .join("|");

    if (lastFlushedSignatureRef.current === signature) return;
    lastFlushedSignatureRef.current = signature;

    const operations = pending
      .map(shapeToOperation)
      .filter((op): op is NonNullable<typeof op> => op !== null);
    if (operations.length === 0) return;

    const requestBody: BatchUpdateShapes = {
      labSlug,
      operations,
    };

    try {
      isPersistingRef.current = true;
      const res = await batchUpdateShapes(requestBody);

      for (const { shapeId, commitVersion } of res.applied) {
        store.markAsSynced(shapeId, commitVersion);

        const shape = store.shapes[shapeId];
        if (shape?.persistStatus === "deleted") {
          store.shapesActions.remove(shapeId);
        }
      }

      lastFlushedSignatureRef.current = null;
    } catch (error) {
      lastFlushedSignatureRef.current = null;
      console.error("Error persisting shapes:", error);
    } finally {
      isPersistingRef.current = false;
    }
  }, [labSlug]);

  useEffect(() => {
    const unsubscribe = useCanvasStore.subscribe(selectCommitSignal, () => {
      const store = useCanvasStore.getState();
      if (!store.hasHydrated) return;
      scheduleFlush(flush);
    });

    return unsubscribe;
  }, [flush]);
}
