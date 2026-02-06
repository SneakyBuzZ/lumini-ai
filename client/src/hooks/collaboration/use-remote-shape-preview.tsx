import useCanvasStore from "@/lib/store/canvas-store";
import { ShapePreviewEvent } from "@/lib/types/canvas-type";
import { useEffect } from "react";

function useRemoteShapePreview(ws: WebSocket | null) {
  const setPreview = useCanvasStore((s) => s.preview.set);
  const clearPreview = useCanvasStore((s) => s.preview.clear);

  useEffect(() => {
    if (!ws) return;

    const onMessage = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === "shape:preview") {
        const evt = data as ShapePreviewEvent;
        setPreview(evt.shapeId, evt.patch);
        return;
      }

      if (data.type === "shape:commit") {
        for (const commit of data.commits ?? []) {
          clearPreview(commit.shapeId);
        }
      }
    };

    ws.addEventListener("message", onMessage);
    return () => ws.removeEventListener("message", onMessage);
  });

  return {};
}

export default useRemoteShapePreview;
