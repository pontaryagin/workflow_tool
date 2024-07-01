'use client'
import { createContext } from "react"
import { Workflow, User } from "@/lib/model"

export type WorkflowContextType = {
  workflow: Workflow,
  setWorkflow: (_: Workflow) => void,
  currentUser: User,
}

export type UserContextType = {
  currentUser: User,
}

export const WorkflowContext = createContext<WorkflowContextType>(
  undefined as never // postpone initialization to WorkflowContext.Provider
)

export const UserContext = createContext<UserContextType>(
  undefined as never // postpone initialization to UserContext.Provider
)
