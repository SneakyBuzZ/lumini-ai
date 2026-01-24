import { useEffect } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { useGetUser } from "@/lib/api/queries/user-queries";
import { ShapeCommitBatchEvent } from "@/lib/types/canvas-type";

export default function useRemoteShapeCommits(ws: WebSocket | null) {
  const applyRemoteShapeCommit = useCanvasStore(
    (s) => s.shapesActions.applyRemoteShapeCommit,
  );

  const { data: user } = useGetUser();

  useEffect(() => {
    if (!ws || !user) return;

    const onMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as ShapeCommitBatchEvent & {
        authorId?: string;
      };

      if (data.type !== "shape:commit") return;
      if (data.authorId === user.id) return;

      for (const commit of data.commits) {
        applyRemoteShapeCommit(commit);
      }
    };

    ws.addEventListener("message", onMessage);
    return () => {
      ws.removeEventListener("message", onMessage);
    };
  }, [ws, user, applyRemoteShapeCommit]);
}
