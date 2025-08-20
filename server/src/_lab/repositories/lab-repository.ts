import { db } from "@/lib/config/db-config";
import { CreateLabDTO } from "@/_lab/dto";
import { labSettingsTable, labsTable } from "@/_lab/models/lab-table";
import { and, count, eq } from "drizzle-orm";

export class LabRepository {
  public labConfig = config;

  async save(data: CreateLabDTO, creatorId: string) {
    const slug = data.name.split(" ").join("-").toLowerCase();
    const [lab] = await db
      .insert(labsTable)
      .values({ ...data, creatorId, slug })
      .returning({ labId: labsTable.id });

    await db.insert(labSettingsTable).values({
      labId: lab.labId,
      ...this.labConfig[data.plan],
    });
  }

  async countLabs(workspaceId: string) {
    const [labs] = await db
      .select({ count: count() })
      .from(labsTable)
      .where(and(eq(labsTable.workspaceId, workspaceId)));
    return labs.count;
  }

  async findAll(workspaceId: string, userId: string) {
    return await db.query.labsTable.findMany({
      where: (labs, { and, eq }) =>
        and(eq(labs.workspaceId, workspaceId), eq(labs.creatorId, userId)),
      columns: {
        creatorId: false,
        workspaceId: false,
      },
      with: {
        creator: {
          columns: {
            id: true,
            image: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }
}

const config = {
  free: {
    maxLabUsers: 5,
  },
  pro: {
    maxLabUsers: 10,
  },
  enterprise: {
    maxLabUsers: 30,
  },
};
