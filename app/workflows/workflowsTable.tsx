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
import {
  getWorkflow, User, Workflow, Action, updateAction, findManyUser, updateActionToDone,
  WorkflowMin, createWorkflow, createAction, createWorkflowFromSingleTask
} from "@/lib/model"
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
import { loadUserList } from "@/lib/user"
import { IoArrowRedoSharp } from "react-icons/io5"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { FaExclamationTriangle } from "react-icons/fa"

const TIME_FORMAT = "yyyy-MM-dd HH:mm:ss"

export function DialogNewWorkflow() {
  const [alert, setAlert] = React.useState<string | null>(null)
  const submitNewWorkflow = async (formData: FormData) => {
    const name = formData.get('name')?.toString()
    const description = formData.get('description')?.toString() || ""
    const assignees = formData.getAll('assignee').map((id) => id.toString())
    if (name == null) {
      setAlert("Name is required")
      return
    }
    console.log("assignees", assignees)
    if (assignees.length == 0 || assignees[0] == "") {
      setAlert("Assignee is required")
      return
    }
    await createWorkflowFromSingleTask(name, "user0", description, assignees) // TODO: get current user 
    setAlert(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="">
        <Button variant="outline" className="">New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={ submitNewWorkflow }>
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
            <div className="my-2 text-destructive border border-destructive p-3 rounded-md">
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
    <div className="flex justify-end">
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
              <a href={ `/workflow/${workflow.id}` } className="font-medium text-primary hover:underline">
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
