import { db } from "@/lib/config/db-config";
import { CreateLabDTO, UpdateGeneralType } from "@/_lab/dto";
import { labSettingsTable, labsTable } from "@/_lab/models/lab-table";
import { and, count, eq } from "drizzle-orm";
import { usersTable } from "@/_user/models/user-model";
import { getSlug } from "@/utils/slug";

export class LabRepository {
  public labConfig = config;

  async save(data: CreateLabDTO, creatorId: string) {
    const [lab] = await db
      .insert(labsTable)
      .values({ ...data, creatorId, slug: getSlug() })
      .returning({ id: labsTable.id });

    await db.insert(labSettingsTable).values({
      labId: lab.id,
      ...this.labConfig[data.plan],
    });

    return lab.id;
  }

  async countLabs(workspaceId: string) {
    const [labs] = await db
      .select({ count: count() })
      .from(labsTable)
      .where(and(eq(labsTable.workspaceId, workspaceId)));
    return labs.count;
  }

  async findById(labId: string) {
    const lab = await db.query.labsTable.findFirst({
      where: (labs, { eq }) => eq(labs.id, labId),
      columns: {
        id: false,
      },
    });
    return lab;
  }

  async findWorkspaceId(labId: string) {
    const [lab] = await db
      .select({ workspaceId: labsTable.workspaceId })
      .from(labsTable)
      .where(eq(labsTable.id, labId))
      .limit(1);
    return lab.workspaceId;
  }

  async findBySlug(slug: string) {
    const [lab] = await db
      .select()
      .from(labsTable)
      .where(eq(labsTable.slug, slug))
      .limit(1);
    return lab;
  }

  async findAll(workspaceId: string) {
    return await db.query.labsTable.findMany({
      where: (labs, { and, eq }) => and(eq(labs.workspaceId, workspaceId)),
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
