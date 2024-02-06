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
  return (
    <div>
      <h1 className="mb-5">Workflow Table</h1>
      <WorkflowTable { ...{ workflow } } />
      <h1 className="mt-10 mb-5">Workflow Chart</h1>
      <WorkflowChart { ...{ workflow } } />
    </div>
  )
}
