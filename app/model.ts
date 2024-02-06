
import {Prisma, PrismaClient} from "@prisma/client"

export type User = Prisma.UserGetPayload<{}>

export const getWorkflow = async (workflow_id: number) => {
  const prisma = new PrismaClient()
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflow_id,
    },
    include: {
      actions: {
        include: {
          parents: true,
          assignee: true,
        }
      },
    }
  })
  return workflow
}