'use client'
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
import { getWorkflow, User, Workflow, Action, updateAction, findManyUser, updateActionToDone, WorkflowMin, createWorkflow, createAction } from "@/lib/model"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Select, { StylesConfig } from 'react-select'
import { Prisma, PrismaClient } from "@prisma/client"
import React from 'react'
import { format } from 'date-fns'
import { Textarea } from "@/components/ui/textarea"
import AsyncSelect from 'react-select/async'
import { loadUserList } from "@/app/user"
import { IoArrowRedoSharp } from "react-icons/io5"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { FaExclamationTriangle } from "react-icons/fa"

const TIME_FORMAT = "yyyy-MM-dd HH:mm:ss"



const submitNewWorkflow = async (formData: FormData) => {
  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString() || ""
  const assignees = formData.getAll('assignee').map((id) => id.toString())
  if (name == null) {
    return "Name is required"
  }
  console.log("assignees", assignees)
  if (assignees.length == 0 || assignees[0] == "") {
    return "Assignee is required"
  }
  const workflow = await createWorkflow({
    data: {
      name: name,
      description: description,
    }
  })
  const actions = await Promise.all(assignees.map((assignee) => {
    return createAction({
      data: {
        name: name,
        status: "ToDo",
        memo: "",
        assignee: { connect: { id: assignee } },
        description: "",
        workflow: { connect: { id: workflow.id } }
      }
    })
  }))

}

export function DialogNewWorkflow() {
  const [alert, setAlert] = React.useState<string | null>(null)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={ async (formData: FormData) => {
          const alert = await submitNewWorkflow(formData)
          if (alert) { setAlert(alert) }
        } }>
          <DialogHeader>
            <DialogTitle>New Workflow</DialogTitle>
            <DialogDescription>
              Create a new workflow from single task
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Name
              </Label>
              <AsyncSelect
                name="assignee"
                id="assignee"
                isMulti
                defaultOptions
                loadOptions={ loadUserList }
                className="col-span-3" >
              </AsyncSelect>
            </div>
          </div>
          { alert &&
            <div className="my-2 text-destructive border border-destructive p-2">
              <FaExclamationTriangle className="h-4 w-4" />
              { alert }
            </div>
          }
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


export const WorkflowsTable = ({ workflows }: { workflows: WorkflowMin[] }) => {
  return <>
    <div className="flex justify-between ">
      <DialogNewWorkflow></DialogNewWorkflow>
    </div >
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Create Time</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        { workflows.map((workflow) => (
          <TableRow key={ workflow.id }>
            <TableCell>
              { workflow.id }
            </TableCell>
            <TableCell>
              <a href={ `/workflow/${workflow.id}` } className="text-blue-500 underline">
                { workflow.name }
              </a>
            </TableCell>
            <TableCell>
              { format(workflow.create_time, TIME_FORMAT) }
            </TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table >
  </>
}
