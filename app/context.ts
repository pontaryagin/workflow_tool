'use client'
import { createContext } from "react"
import { Workflow } from "@/app/model"

export type WorkflowContextType = {
  workflow: Workflow,
  setWorkflow: (_: Workflow) => void
}

export const WorkflowContext = createContext<WorkflowContextType>(
  null as unknown as WorkflowContextType // postpone initialization to WorkflowContext.Provider
)
