'use client'

import { User } from '@/lib/model'
import { findManyUser } from '@/lib/model'

export const formatUser = (user?: User) => {
  if (!user) return ""
  return `${user.first_name} ${user.last_name}(${user.id})`
}

export const loadUserList = async (inputValue: string) => {
  const users = await findManyUser({
    where: {
      OR: [
        { id: { startsWith: inputValue } },
        { first_name: { startsWith: inputValue } },
        { last_name: { startsWith: inputValue } },
      ]
    }
  })
  return users.map(
    user => ({
      value: user.id,
      label: formatUser(user),
    })
  )
}