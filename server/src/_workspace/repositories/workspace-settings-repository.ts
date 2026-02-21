import { db } from "@/lib/config/db-config";
import { workspaceSettingsTable } from "../models/workspace-settings-model";
import { eq } from "drizzle-orm";
import { workspacesTable } from "../models/workspace-model";
import {
  UpdateWorkspaceGeneralDTOType,
  UpdateWorkspacePreferencesDTOType,
} from "../dto";

export class WorkspaceSettingsRepository {
  async findGeneral(workspaceId: string) {
    const [generalSettings] = await db
      .select({
        name: workspacesTable.name,
        slug: workspacesTable.slug,
        settings: {
          visibility: workspaceSettingsTable.visibility,
          defaultLanguage: workspaceSettingsTable.defaultLanguage,
          notificationsEnabled: workspaceSettingsTable.notificationsEnabled,
        },
      })
      .from(workspaceSettingsTable)
      .leftJoin(
        workspacesTable,
        eq(workspaceSettingsTable.workspaceId, workspacesTable.id),
      )
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));

    return generalSettings;
  }

  async updateGeneral(
    data: UpdateWorkspaceGeneralDTOType,
    workspaceId: string,
  ) {
    await db
      .update(workspacesTable)
      .set(data)
      .where(eq(workspacesTable.id, workspaceId));
  }

  async updatePreferences(
    data: UpdateWorkspacePreferencesDTOType,
    workspaceId: string,
  ) {
    await db
      .update(workspaceSettingsTable)
      .set(data)
      .where(eq(workspaceSettingsTable.workspaceId, workspaceId));
  }
}
