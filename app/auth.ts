"use server"
import { cookies } from "next/headers"
import Image from "next/image"
import { findUniqueUser } from "./model"


export async function submitAction(formData: FormData) {
  const name = formData.get("name")?.toString()
  if (name) {
    cookies().set("name", name)
  }
}

export async function logout() {
  cookies().delete("name")
}

export async function getCurrentUser() {
  const userId = cookies().get("name")?.value
  if (userId == null || userId === "") {
    return null
  }
  const currentUser = await findUniqueUser({ where: { id: userId } })
  if (currentUser == null) {
    return new Error("User not found. userId=" + userId)
  }
  return currentUser
}
