import { SaveWorkspaceDTOType } from "@/_workspace/dto";
import { workspacesTable } from "../models/workspace-model";
import { db } from "@/lib/config/db-config";
import { eq } from "drizzle-orm";

export class WorkspaceRepository {
  async save(data: SaveWorkspaceDTOType) {
    await db.insert(workspacesTable).values(data);
  }

  async findAllAndUser(userId: string) {
    const workspaces = await db
      .select({
        name: workspacesTable.name,
        plan: workspacesTable.plan,
        slug: workspacesTable.slug,
        createdAt: workspacesTable.createdAt,
      })
      .from(workspacesTable)
      .where(eq(workspacesTable.ownerId, userId));

    return workspaces;
  }
}
