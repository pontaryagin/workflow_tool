"use client"
import {WorkflowChart} from "./workflow_chart"
import {WorkflowTable} from "./workflow_table"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

type WorkflowProps = {
  username: string,
}

type Workflow = {
    actions: Action[],
}

type Action = {
    assigned_user: string,
    name: string,
    requirements: string[],
    status: string,
    memo: string,
}

export const Workflow = ({username}: WorkflowProps) => {
  return (
    <div>
      <h1>Workflow Table</h1>
      <WorkflowTable workflow_id={9}/>
      <h1>Workflow Chart</h1>
      <WorkflowChart/>
    </div>
  )
}
