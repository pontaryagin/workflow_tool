'use server'
import { Prisma, PrismaClient } from "@prisma/client"

export type User = Prisma.UserGetPayload<{}>
export type Workflow = Prisma.WorkflowGetPayload<{ include: { actions: { include: { assignee: true, parents: true } } } }>
export type Action = Prisma.ActionGetPayload<{ include: { assignee: true, parents: true } }>

const prisma = new PrismaClient()
export const getWorkflow = async (workflow_id: number) => {
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

export const mutation = {
  action: {
    update: prisma.action.update
  }
}
