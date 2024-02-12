'use server'
import { Prisma, PrismaClient } from "@prisma/client"
import { createContext, useContext } from "react"
import { getGraph, getActionGraph } from "./graph"
import { sortBy } from 'lodash'

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

export const updateAction = prisma.action.update
export const findManyUser = prisma.user.findMany

