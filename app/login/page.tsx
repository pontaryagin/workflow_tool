import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { redirect, useParams, useRouter } from 'next/navigation'
import { curry } from "lodash"

import { cookies } from "next/headers"
import { use } from "react"
import { headers } from "next/headers"
import { findUniqueUser } from "@/lib/model"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { FaExclamationTriangle } from "react-icons/fa"

async function submitAction(formData: FormData) {
  "use server"
  const name = formData.get("name")?.toString()
  const user = await findUniqueUser({ where: { id: name } })
  if (user == null) {
    throw redirect(`/login?error=${encodeURIComponent(`User not found: ${name}`)}`)
  }
  if (name) {
    cookies().set("name", name)
  }
  const nextUrl = formData.get("next")
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
  const error = searchParams["error"]
  return <main className="p-12">
    <form action={ submitAction }>
      <Input type="hidden" name="next" value={ next } />
      <Input type="text" name="name" placeholder="name" className="mb-2" />
      { error &&
        <Alert variant="destructive" className="my-2">
          <FaExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            { error }
          </AlertDescription>
        </Alert>
      }
      <Button type="submit">submit</Button>
    </form>
  </main>
}

