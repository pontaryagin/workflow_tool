import * as React from "react"
import { cookies } from "next/headers"
// import { getName } from "./auth";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { WorkflowMain } from "./workflow"
import { User, findUniqueOrThrowUser, findUniqueUser, getUser, getWorkflow } from "@/app/model"
import { prisma } from "@/app/db"

async function submitAction(formData: FormData) {
  "use server"
  const name = formData.get("name")?.toString()
  if (name) {
    cookies().set("name", name)
  }
}

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

const UsernameForm = () => {
  return <>
    <form action={ submitAction }>
      <Input type="text" name="name" placeholder="name" className="mb-2" />
      <Button type="submit">submit</Button>
    </form>
  </>
}

export default async function Home() {
  const workflow = await getWorkflow(9)
  const userId = cookies().get("name")?.value
  if (userId == null || userId === "") {
    return <UsernameForm />
  }
  console.log(`userId: ${userId}`)
  // const currentUser = await getUser(userId)
  const currentUser = await findUniqueUser({ where: { id: userId } })
  if (currentUser == null) {
    return <UsernameForm />
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

