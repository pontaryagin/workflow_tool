"use client"
type WorkflowProps = {
  username: string,
}

type Workflow = {
    actions: Action[],
}

type Action = {
    assigned_user: string,
    name: string,
    requirements: string[],
    status: string,
    memo: string,
}

const BASE_TASK: Workflow = {actions: [
  {assigned_user: "user1", name: "test", requirements: [], status: "Done", memo: ""},
  {assigned_user: "user1", name: "test2", requirements: ["test"], status: "InProgress", memo: "start"},
  {assigned_user: "user1", name: "test3", requirements: ["test", "test2"], status: "ToDo", memo: "start"},
]}


export const Workflow = ({username}: WorkflowProps) => {
  return (
    <div>
      <h1>Workflow</h1>
      <p>
      </p>
    </div>
  )
}
