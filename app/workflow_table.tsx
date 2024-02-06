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
import { use, useEffect, useState } from "react"
import { getWorkflow, User, Workflow, Action } from "@/app/model"
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

const ActionEditor = ({ action }: { action: Action }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Action</DialogTitle>
          <DialogDescription>
            Make changes to the action { action.name }. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function WorkflowTable({ workflow }: { workflow: Workflow }) {
  const formatUser = (user: User) => {
    return `${user.first_name} ${user.last_name}(${user.id})`
  }
  const editWorkflow = async (formData: FormData) => {
    const id = formData.get("workflow_id")!
    const workflow = await getWorkflow(Number(id))
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Action</TableCell>
          <TableCell>Depends on</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Assignee</TableCell>
          <TableCell>Memo</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        { workflow.actions.map((action) => (
          <TableRow key={ action.id }>
            <TableCell>{ action.name }</TableCell>
            <TableCell>{ action.parents.map(action => action.name).join(",") }</TableCell>
            <TableCell>{ action.status }</TableCell>
            <TableCell>{ action.assignee ? formatUser(action.assignee) : "" }</TableCell>
            <TableCell>{ action.memo }</TableCell>
            <TableCell>
              <ActionEditor action={ action } />
              {/* <Button onClick={ async () => {
                const wf = await getWorkflow(9)
                console.log(wf)
              } }>Edit</Button> */}
            </TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table>
  )
}
