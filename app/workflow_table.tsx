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
import { use, useContext, useEffect, useState } from "react"
import { getWorkflow, User, Workflow, Action, updateAction } from "@/app/model"
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
import Select from 'react-select'
import { Prisma, PrismaClient } from "@prisma/client"


const ActionEditor = ({ action, workflow }: { action: Action, workflow: Workflow }) => {
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
            <Input id="name" value={ action.name } className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parents" className="text-right">
              Depends On
            </Label>
            <Select
              id="parents"
              defaultValue={ action.parents.map(parent => ({ value: parent.id, label: parent.name })) }
              isMulti
              name="colors"
              options={ workflow.actions.map(action => ({ value: action.id, label: action.name })) }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>
import { WorkflowContext } from "./context"
export function WorkflowTable() {
  const { workflow, setWorkflow } = useContext(WorkflowContext)
  const formatUser = (user: User) => {
    return `${user.first_name} ${user.last_name}(${user.id})`
  }
  const onChangeName = async (e: ChangeEvent, action: Action) => {
    const action_ = await updateAction({
      where: {
        id: action.id,
      },
      data: {
        name: e.target.value,
      }
    })
    console.log("onChangeName")
    console.log(action_)
    setWorkflow(await getWorkflow(workflow.id))
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
            <TableCell>
              {/* <Label htmlFor="name" className="text-right">
                  Name
                </Label> */}
              <Input defaultValue={ action.name }
                onBlur={ (e) => onChangeName(e, action) }
                className="outline-none border-transparent focus:border-transparent focus:ring-0" />
              {/* { action.name } */ }
            </TableCell>
            <TableCell>{ action.parents.map(action => action.name).join(",") }</TableCell>
            <TableCell>{ action.status }</TableCell>
            <TableCell>{ action.assignee ? formatUser(action.assignee) : "" }</TableCell>
            <TableCell>{ action.memo }</TableCell>
            <TableCell>
              <ActionEditor { ...{ workflow, action } } />
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
