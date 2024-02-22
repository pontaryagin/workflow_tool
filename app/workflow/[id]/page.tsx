import * as React from "react"
import { cookies } from "next/headers"
// import { getName } from "./auth";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { WorkflowMain } from "../../workflow"
import { User, findUniqueOrThrowUser, findUniqueUser, getUser, getWorkflow } from "@/app/model"
import { redirect } from "next/navigation"
import { toNumber } from "lodash"



export default async function Home({ params }: { params: { id: string } }) {
  console.log("params", params)
  const workflow = await getWorkflow(toNumber(params.id))
  const userId = cookies().get("name")?.value
  if (userId == null || userId === "") {
    redirect(`/login?next=${encodeURIComponent("/")}`)
  }
  const currentUser = await findUniqueUser({ where: { id: userId } })
  if (currentUser == null) {
    return <main className="p-12">
      <div>Please register your account</div>
    </main>
  }
  return (
    <main className="flex flex-col justify-between p-12">
      <WorkflowMain { ...{ workflow, currentUser } } />
    </main>
  )
}

