import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { redirect, useParams, useRouter } from 'next/navigation'
import { curry } from "lodash"

import { cookies } from "next/headers"
import { use } from "react"
import { headers } from "next/headers"
async function submitAction(formData: FormData) {
  "use server"
  const name = formData.get("name")?.toString()
  if (name) {
    cookies().set("name", name)
  }
  const nextUrl = formData.get("next")
  console.log("nextUrl", nextUrl)
  if (typeof nextUrl == "string") {
    redirect(nextUrl)
  }
}

export default function UsernameForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const next = searchParams["next"]
  return <main className="p-12">
    <form action={ submitAction }>
      <Input type="hidden" name="next" value={ next } />
      <Input type="text" name="name" placeholder="name" className="mb-2" />
      <Button type="submit">submit</Button>
    </form>
  </main>
}

