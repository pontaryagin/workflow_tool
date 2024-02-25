'use server'
import { Prisma, PrismaClient } from "@prisma/client"
import { createContext, useContext } from "react"
import { getGraph, getActionGraph } from "@/lib/graph"
import { sortBy } from 'lodash'
import { prisma } from "@/lib/prisma"

export type User = Prisma.UserGetPayload<{}>
export type Workflow = Prisma.WorkflowGetPayload<{ include: { actions: { include: { assignee: true, parents: true } } } }>
export type WorkflowMin = Prisma.WorkflowGetPayload<{}>
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

export const createWorkflowFromSingleTask = async (name: string, creator: string, description: string, assignees: string[]) => {
  prisma.$transaction(async (tx) => {
    const workflow = await tx.workflow.create({
      data: {
        name: name,
        description: description,
      }
    })
    const actions = await Promise.all(
      assignees.map(
        async (assignee, i) => {
          return await tx.action.create({
            data: {
              name: `Task ${i}`,
              status: "ToDo",
              memo: "",
              assignee: { connect: { id: assignee } },
              description: "",
              workflow: { connect: workflow }
            }
          })
        }
      )
    )
    await tx.action.create({
      data: {
        name: `Final Check`,
        status: "ToDo",
        memo: "",
        assignee: { connect: { id: assignees[0] } },
        description: "Final Check",
        workflow: { connect: workflow },
        parents: {
          connect: actions
        }
      }
    })
  })
}

export const createAction = prisma.action.create
export const updateAction = prisma.action.update
export const findManyUser = prisma.user.findMany
export const findUniqueOrThrowUser = prisma.user.findUniqueOrThrow
export const findUniqueUser = prisma.user.findUnique
export const findManyWorkflow = prisma.workflow.findMany
export const createWorkflow = prisma.workflow.create

export const getUser = async (id: string) => {
  return await findUniqueUser({
    where: {
      id,
    }
  })
}
