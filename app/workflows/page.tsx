import * as React from "react"
import { cookies } from "next/headers"
// import { getName } from "./auth";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { User, findManyWorkflow, findUniqueOrThrowUser, findUniqueUser, getUser, getWorkflow } from "@/app/model"
import { redirect } from "next/navigation"
import { toNumber } from "lodash"
import { WorkflowsTable } from "./workflowsTable"

export const Page = async () => {
  const workflows = await findManyWorkflow({ orderBy: { id: "asc" } })
  return (
    <main className="flex flex-col justify-between p-12">
      <WorkflowsTable { ...{ workflows } }></WorkflowsTable>
    </main>
  )
}

export default Page
