import { Prisma, PrismaClient } from '@prisma/client'
import { range } from '../utils/basic'
import { prisma } from '@/lib/prisma'

(async () => {
  const users_ = range(0, 3).map(i => ({
    id: `user${i}`,
    first_name: `first${i}`,
    last_name: `last${i}`,
  }))

  const users = await prisma.$transaction(users_.map(user => prisma.user.create({ data: user })))

  const workflow = await prisma.workflow.create({
    data: {
      name: "test",
    }
  })

  const node = await prisma.action.create({
    data: {
      name: `node1`, status: "InProgress", memo: "memo",
      assignee: { connect: users[0] }, workflow: { connect: workflow }
    }
  })
  const node2 = await prisma.action.create({
    data: {
      name: `node2`, status: "ToDo", memo: "memo2",
      assignee: { connect: users[1] }, workflow: { connect: workflow }, parents: { connect: [node,] }
    }
  })
  const node3 = await prisma.action.create({
    data: {
      name: `node3`, status: "ToDo", memo: "memo3",
      assignee: { connect: users[2] }, workflow: { connect: workflow }, parents: { connect: [node, node2,] }
    }
  })
})()



