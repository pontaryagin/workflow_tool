'use client'
import { createContext } from "react"
import { Workflow, User } from "@/app/model"

export type WorkflowContextType = {
  workflow: Workflow,
  setWorkflow: (_: Workflow) => void,
  currentUser: User,
}

export const WorkflowContext = createContext<WorkflowContextType>(
  null as unknown as WorkflowContextType // postpone initialization to WorkflowContext.Provider
)
