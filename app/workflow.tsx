import { getWorkflow } from "./model"
import { WorkflowChart } from "./workflow_chart"
import { WorkflowTable } from "./workflow_table"
import { PrismaClient } from "@prisma/client"

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

export const Workflow = async ({ username }: WorkflowProps) => {
  const workflow = await getWorkflow(9)
  const action = async (id: number) => {
    "use server"
    const workflow = await getWorkflow(id)
    console.log(workflow)
  }
  return (
    <div>
      <h1>Workflow Table</h1>
      <WorkflowTable workflow={ workflow } action={ action } />
      <h1>Workflow Chart</h1>
      <WorkflowChart />
    </div>
  )
}
