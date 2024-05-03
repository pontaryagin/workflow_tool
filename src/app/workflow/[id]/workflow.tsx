'use client'
import { WorkflowChart } from "./workflowChart"
import { WorkflowTable } from "./workflowTable"
import { User, Workflow } from "@/lib/model"
import { WorkflowContext } from "../../context"
import React from "react"

const WorkflowDescription = ({ workflow }: { workflow: Workflow }) => {
  return <div>
    <h1 className="mb-5 text-large">{ }</h1>
    <h1 className="text-4xl font-extrabold">
      { workflow.name }
    </h1>
    <p className="mt-5">
      { workflow.description ? workflow.description : "No information" }
    </p>
  </div>
}

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
        <WorkflowDescription workflow={ workflow_ } />
        {/* <h1 className="mt-10 mb-5 text-3xl fond-bold">Workflow Table</h1> */ }
        <div className="mt-10"></div>
        <WorkflowTable />
        {/* <h1 className="mt-10 mb-5  text-3xl fond-bold">Workflow Chart</h1> */ }
        <WorkflowChart />
      </WorkflowContext.Provider>
    </div >
  )
}
