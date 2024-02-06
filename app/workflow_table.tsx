import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {use} from "react"
import {getWorkflow, User} from "./model"

  
export function WorkflowTable({workflow_id}: {workflow_id: number}) {
  const workflow = use(getWorkflow(workflow_id))
  const formatUser = (user: User) => {
    return `${user.first_name} ${user.last_name}(${user.id})`
  }

  return (
    <Table>
      {/* <TableCaption></TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableCell>Action</TableCell>
          <TableCell>Depends on</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Assignee</TableCell>
          <TableCell>Memo</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflow.actions.map((action) => (
          <TableRow key={action.name}>
            <TableCell>{action.name}</TableCell>
            <TableCell>{action.parents.map(action => action.name)}</TableCell>
            <TableCell>{action.status}</TableCell>
            <TableCell>{action.assignee ? formatUser(action.assignee): ""}</TableCell>
            <TableCell>{action.memo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
  