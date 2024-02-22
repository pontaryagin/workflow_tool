'use client'
import { WorkflowChart } from "./workflow_chart"
import { WorkflowTable } from "./workflow_table"
import { User, Workflow } from "@/app/model"
import { WorkflowContext } from "../../context"
import React from "react"


export const WorkflowMain = ({ workflow, currentUser }: { workflow: Workflow, currentUser: User }) => {
  const [workflow_, setWorkflow] = React.useState<Workflow>(workflow)
  const context = {
    workflow: workflow_,
    setWorkflow: setWorkflow,
    currentUser,
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