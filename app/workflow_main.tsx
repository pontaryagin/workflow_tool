"use client"
import { createContext, useState } from "react"
import { WorkflowChart } from "./workflow_chart"
import { WorkflowTable } from "./workflow_table"
import { Workflow } from "@/app/model"
import { WorkflowContext, WorkflowContextType, workflowContextDefaultValue } from "./context"


export const WorkflowMain = ({ workflow }: { workflow: Workflow }) => {
  const [workflow_, setWorkflow] = useState<Workflow>(workflow)
  const context = {
    workflow: workflow_,
    setWorkflow: setWorkflow,
  }
  return (
    <div>
      <WorkflowContext.Provider value={ context } >
        <h1 className="mb-5">Workflow Table</h1>
        <WorkflowTable />
        <h1 className="mt-10 mb-5">Workflow Chart</h1>
        <WorkflowChart />
      </WorkflowContext.Provider>
    </div >
  )
}
