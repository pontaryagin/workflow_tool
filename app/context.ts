'use client'
import { createContext } from "react"
import { Workflow } from "@/app/model"

export type WorkflowContextType = {
  workflow: Workflow,
  setWorkflow: (_: Workflow) => void
}

export const workflowContextDefaultValue = {
  workflow: {} as Workflow,
  setWorkflow: () => { throw new Error('setWorkflow was used before set') },
}

export const WorkflowContext = createContext<WorkflowContextType>(
  workflowContextDefaultValue
)
