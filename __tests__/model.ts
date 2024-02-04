import { Prisma } from '@prisma/client'

const prisma = jestPrisma.client

function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, i) => i + start)
}

test('should create data', async () => {
  const users_ = range(0,3).map(i => ({
    id: `test${i}`,
    first_name : `first${i}`,
    last_name: `last${i}`,
  }))

  const users = await prisma.$transaction(users_.map(user=> prisma.user.create({data: user})))

  const user_created = await prisma.user.findUnique({where: {id: "test0"}})

  expect(user_created).toEqual({
    id: "test0",
    first_name : "first0",
    last_name: "last0",
  })
  const workflow = await prisma.workflow.create({ data: {
    name: "test",
  }})

  const node = await prisma.action.create({data:
        {name: `node1`, status: "Done", memo: "memo",
          assignee: {connect: users [0]}, workflow: {connect: workflow}}
  })
  const node2 = await prisma.action.create({data: 
        {name: `node2`, status: "ToDo", memo: "memo2",
          assignee: {connect: users[1]}, workflow: {connect: workflow}, parents: {connect: [node, ]}}
  })
  const node3 = await prisma.action.create({data: 
    {name: `node3`, status: "ToDo", memo: "memo3",
      assignee: {connect: users[2]}, workflow: {connect: workflow}, parents: {connect: [node, node2, ]}}
  })
  const node3_created = await prisma.action.findFirst({where: {name: "node3"}, select: {parents: true, children: true}})
  expect(node3_created?.parents).toEqual([node, node2])
  expect(node3_created?.children).toEqual([])

  const node2_created = await prisma.action.findFirst({where: {name: "node2"}, select: {parents: true, children: true}})
  expect(node2_created?.parents).toEqual([node])
  expect(node2_created?.children).toEqual([node3])
})