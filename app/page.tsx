import * as React from "react"
import { cookies } from "next/headers"
// import { getName } from "./auth";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { WorkflowMain } from "./workflow"
import { User, findUniqueOrThrowUser, findUniqueUser, getUser, getWorkflow } from "@/app/model"
import { redirect } from "next/navigation"

async function logout(formData: FormData) {
  "use server"
  cookies().delete("name")
}

export function DropdownMenuCheckboxes({ currentUser }: { currentUser: User }) {
  return <>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge>{ currentUser.id }</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <form action={ logout }>
            <button type="submit">Logout</button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}

export default async function Home() {
  const workflow = await getWorkflow(1)
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
      <div className="flex flex-row-reverse">
        <DropdownMenuCheckboxes { ...{ currentUser } } />
      </div>
      <WorkflowMain { ...{ workflow, currentUser } } />
    </main>
  )
}

