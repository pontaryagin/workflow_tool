import { cookies } from "next/headers"
import Image from "next/image"


async function submitAction(formData: FormData) {
  "use server"
  const name = formData.get("name")?.toString()
  if (name)
  {
    cookies().set("name", name)
  }
}

  
export {submitAction}
