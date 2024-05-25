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
  null as unknown as WorkflowContextType // postpone initialization to WorkflowContext.Provider
)

export const UserContext = createContext<UserContextType>(
  null as unknown as UserContextType // postpone initialization to UserContext.Provider
)
