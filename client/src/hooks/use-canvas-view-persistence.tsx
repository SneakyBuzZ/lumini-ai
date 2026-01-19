import { useEffect, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { upsertView } from "@/lib/api/lab-api";
import { UpsertView } from "@/lib/api/dto";

export function useCanvasViewPersistence(labId: string) {
  const timeoutRef = useRef<number | null>(null);
  const lastRef = useRef<UpsertView | null>(null);

  useEffect(() => {
    const unsubscribe = useCanvasStore.subscribe(
      (s) => [s.scale, s.offsetX, s.offsetY],
      ([scale, offsetX, offsetY]) => {
        const { hasHydrated } = useCanvasStore.getState();
        if (!hasHydrated) return;

        const last = lastRef.current;
        if (
          last &&
          last.scale === scale &&
          last.offsetX === offsetX &&
          last.offsetY === offsetY
        ) {
          return;
        }
        lastRef.current = { scale, offsetX, offsetY };

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          upsertView(labId, { scale, offsetX, offsetY });
        }, 300);
      },
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      unsubscribe();
    };
  }, [labId]);
}
