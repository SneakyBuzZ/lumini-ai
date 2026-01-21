import { labsTable } from "@/_lab/models/lab-table";
import { workspaceMembersTable } from "@/_workspace/models/workspace-model";
import { db } from "@/lib/config/db-config";
import { authenticateWS } from "@/middlewares/authenticate-ws-middleware";
import { and, eq } from "drizzle-orm";
import { getUserColor } from "@/lib/ws/utils";
import type { WebSocket } from "ws";
import { IncomingMessage } from "http";

export async function assertLabAccess(userId: string, labId: string) {
  const [access] = await db
    .select({ labId: labsTable.id })
    .from(labsTable)
    .innerJoin(
      workspaceMembersTable,
      eq(labsTable.workspaceId, workspaceMembersTable.workspaceId),
    )
    .where(
      and(eq(labsTable.id, labId), eq(workspaceMembersTable.memberId, userId)),
    )
    .limit(1);

  if (!access) {
    throw new Error("Access denied to the requested lab.");
  }
}

export async function validateSocketConnection(
  socket: WebSocket | undefined,
  req: IncomingMessage,
) {
  if (!socket) throw new Error("WebSocket connection failed");

  const user = authenticateWS(req);
  if (!user) {
    socket.close(1008, "Authentication Failed");
    return;
  }

  socket.user = user;
  const url = new URL(req.url!, "http://localhost");
  const labId = url.searchParams.get("labId");

  if (!labId) {
    socket.close(1008, "labId is required");
    return;
  }

  await assertLabAccess(user.id, labId);
  socket.labId = labId;
  socket.color = getUserColor(user.id);

  return { labId, user, color: socket.color };
}
