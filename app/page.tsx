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


type Checked = DropdownMenuCheckboxItemProps["checked"]
export function DropdownMenuCheckboxes({name}: {name: string}) {
  // const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  // const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  // const [showPanel, setShowPanel] = React.useState<Checked>(false)
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge>{name}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <form action={logout}>
            <button type="submit">Logout</button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default async function Home() {
  console.log("Home")
  const name = cookies().get("name")?.value
  console.log(name)
  // const username = await getName() || "Unknown"
  return (
    <main className="flex flex-col justify-between p-12">
      {name
        ?(<div className="flex flex-row-reverse">
          <DropdownMenuCheckboxes name={name}/>
        </div>)
        :(<div>
          <form action={submitAction}>
            <Input type="text" name="name" placeholder="name" className="mb-2"/>
            <Button type="submit">submit</Button>
          </form>
        </div>)
      }
    </main>
  )
}
