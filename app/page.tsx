// 'use client'
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
import { Workflow } from "./workflow"

async function submitAction(formData: FormData) {
  "use server"
  const name = formData.get("name")?.toString()
  if (name)
  {
    cookies().set("name", name)
  }
}

async function logout(formData: FormData){
  "use server"
  cookies().delete("name")
}

export function DropdownMenuCheckboxes({username}: {username: string}) {
  return <>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge>{username}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <form action={logout}>
            <button type="submit">Logout</button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}

const UsernameForm = () => {
  return <>
    <form action={submitAction}>
      <Input type="text" name="name" placeholder="name" className="mb-2"/>
      <Button type="submit">submit</Button>
    </form>
  </>
}

const Main = ({username}: {username: string}) => {
  return <>
    <div className="flex flex-row-reverse">
      <DropdownMenuCheckboxes username={username}/>
    </div>
    <Workflow {...{username}}/>
  </>
}

export default async function Home() {
  const username = cookies().get("name")?.value
  return (
    <main className="flex flex-col justify-between p-12">
      {username != null && username !== ""
        ?<Main username={username}/>
        :<UsernameForm/>
      }
    </main>
  )
}
