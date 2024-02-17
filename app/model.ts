'use server'
import { Prisma, PrismaClient } from "@prisma/client"
import { createContext, useContext } from "react"
import { getGraph, getActionGraph } from "./graph"
import { sortBy } from 'lodash'
import { prisma } from "@/lib/prisma"

export type User = Prisma.UserGetPayload<{}>
export type Workflow = Prisma.WorkflowGetPayload<{ include: { actions: { include: { assignee: true, parents: true } } } }>
export type Action = Prisma.ActionGetPayload<{ include: { assignee: true, parents: true } }>

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
        },
        orderBy: {
          id: "asc"  // TODO: this should be "order" variable
        }
      },
    }
  })
  const { nodes, edges } = getActionGraph(workflow)
  const graph = getGraph(nodes, edges, false)
  workflow.actions = sortBy(workflow.actions, [(action: Action) => {
    const n = graph.node(action.id.toString())
    return n.y
  }, "id"])
  return workflow
}

export const updateActionToDone = async (action_id: number) => {
  let action = await prisma.action.findUniqueOrThrow({
    where: {
      id: action_id,
    },
    include: {
      children: true,
    }
  })
  if (action.status !== "InProgress") {
    throw new Error("Action is not in progress")
  }
  await prisma.$transaction([
    prisma.action.update({
      where: {
        id: action_id,
      },
      data: {
        status: "Done",
      }
    }),
    prisma.action.updateMany({
      where: {
        parents: {
          every: {
            status: "Done"
          }
        },
        status: "ToDo",
      },
      data: {
        status: "InProgress",
      }
    }),
  ])
}

export const updateAction = prisma.action.update
export const findManyUser = prisma.user.findMany
export const findUniqueOrThrowUser = prisma.user.findUniqueOrThrow
export const findUniqueUser = prisma.user.findUnique

export const getUser = async (id: string) => {
  return await findUniqueUser({
    where: {
      id,
    }
  })
}
