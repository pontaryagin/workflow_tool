'use client'
import { createContext } from "react"
import { Workflow } from "@/app/model"

export type WorkflowContextType = {
  workflow: Workflow,
  setWorkflow: (_: Workflow) => void
  chart: {
    isHorizontal: boolean
    setIsHorizontal: (_: boolean) => void
  }
}

export const workflowContextDefaultValue = {
  workflow: {} as Workflow,
  setWorkflow: () => { },
  chart: {
    isHorizontal: false,
    setIsHorizontal: () => { },
  }
}

export const WorkflowContext = createContext<WorkflowContextType>(
  workflowContextDefaultValue
)

