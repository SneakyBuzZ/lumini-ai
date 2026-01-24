import { db } from "@/lib/config/db-config";
import { NormalizedLanguage } from "@/lib/types/github.type";
import { overviewTable } from "../models/dashboard-table";
import { eq } from "drizzle-orm";
import { OverviewData } from "../dto";

export class DashboardRepository {
  async findOverviewByLabId(labId: string) {
    const [overview] = await db
      .select()
      .from(overviewTable)
      .where(eq(overviewTable.labId, labId))
      .limit(1);
    return overview;
  }

  async upsertOverview(labId: string, data: OverviewData) {
    const [overview] = await db
      .insert(overviewTable)
      .values({
        labId: labId,
        ...data,
        architecture: JSON.stringify({ data: data.architecture }),
        techstack: JSON.stringify(data.techstack),
        languages: JSON.stringify(data.languages),
        refreshedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: overviewTable.labId,
        set: {
          ...data,
          refreshedAt: new Date(),
          architecture: JSON.stringify({ data: data.architecture }),
          techstack: JSON.stringify(data.techstack),
          languages: JSON.stringify(data.languages),
        },
      })
      .returning();
    return overview;
  }
}
