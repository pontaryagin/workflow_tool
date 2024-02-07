import { use } from "react"
import { getWorkflow } from "./model"
import { WorkflowChart } from "./workflow_chart"
import { WorkflowTable } from "./workflow_table"
import { PrismaClient } from "@prisma/client"

import { useRouter } from 'next/navigation'
import { WorkflowMain } from "./workflow_main"

export const Workflow = async () => {
  const workflow = await getWorkflow(9)
  return (
    <WorkflowMain { ...{ workflow } } />
  )
}
