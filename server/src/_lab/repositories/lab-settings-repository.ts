import { db } from "@/lib/config/db-config";
import { labSettingsTable, labsTable } from "../models/lab-table";
import { usersTable } from "@/_user/models/user-model";
import { UpdateGeneralType } from "../dto";
import { eq } from "drizzle-orm";

export class LabSettingsRepository {
  async findSettings(labId: string) {
    const result = await db
      .select({
        general: {
          name: labsTable.name,
          githubUrl: labsTable.githubUrl,
          slug: labsTable.slug,
          createdAt: labsTable.createdAt,
          creatorImage: usersTable.image,
          creatorName: usersTable.name,
          creatorEmail: usersTable.email,
        },
        visibilityAndAccess: {
          visibility: labSettingsTable.visibility,
          allowPublicSharing: labSettingsTable.allowPublicSharing,
          maxLabUsers: labSettingsTable.maxLabUsers,
        },
        vectorDb: {
          vectorDbService: labSettingsTable.vectorDbService,
          vectorDbConnectionString: labSettingsTable.vectorDbConnectionString,
        },
        ai: {
          apiService: labSettingsTable.apiService,
          apiBaseUrl: labSettingsTable.apiBaseUrl,
          modelName: labSettingsTable.modelName,
          temperature: labSettingsTable.temperature,
          isConfigured: labSettingsTable.isConfigured,
          apiKeyLast4: labSettingsTable.apiKeyLastFour,
        },
      })
      .from(labSettingsTable)
      .innerJoin(labsTable, eq(labsTable.id, labSettingsTable.labId))
      .innerJoin(usersTable, eq(usersTable.id, labsTable.creatorId))
      .where(eq(labSettingsTable.labId, labId));

    return result[0];
  }

  async updateGeneralSettings(labId: string, data: UpdateGeneralType) {
    await db
      .update(labsTable)
      .set({
        ...data,
      })
      .where(eq(labsTable.id, labId));
  }
}
