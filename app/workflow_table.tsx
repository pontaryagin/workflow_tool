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
import Select, { StylesConfig } from 'react-select'
import { Prisma, PrismaClient } from "@prisma/client"
import React from 'react'


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
import { Badge } from "@/components/ui/badge"
export function WorkflowTable() {
  const [isEditable, setIsEditable] = React.useState(false)
  const { workflow, setWorkflow } = useContext(WorkflowContext)
  const formatUser = (user: User) => {
    return `${user.first_name} ${user.last_name}(${user.id})`
  }
  const onBlurName = async (e: ChangeEvent, action: Action) => {
    const name = e.target.value
    if (action.name === name) return
    const action_ = await updateAction({
      where: {
        id: action.id,
      },
      data: {
        name: name,
      }
    })
    console.log("onChangeName")
    console.log(action_)
    setWorkflow(await getWorkflow(workflow.id))
  }
  const onChangeParents = async (values: readonly { value: number, label: string }[], action: Action) => {
    const _ = await updateAction({
      where: {
        id: action.id
      },
      data: {
        parents: {
          connect: values.map((v) => ({ id: v.value }))
        }
      }
    })
  }
  return (<>
    <div className="flex flex-row-reverse">
      <Button onClick={ () => { setIsEditable(!isEditable) } } variant={ isEditable ? "outline" : "default" }>Edit</Button>
    </div>
    <Table>
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
        { workflow.actions.map((action) => (
          <TableRow key={ action.id }>
            <TableCell>
              { isEditable
                ? <Input defaultValue={ action.name }
                  onBlur={ (e) => onBlurName(e, action) } />
                : action.name
              }
            </TableCell>
            <TableCell>
              { isEditable
                ? <Select
                  defaultValue={ action.parents.map(parent => ({ value: parent.id, label: parent.name })) }
                  isMulti
                  options={ workflow.actions.map(action => ({ value: action.id, label: action.name })) }
                  onChange={ (e) => onChangeParents(e, action) }
                />
                : <>{ action.parents.map(action => (<Badge key={ action.id } variant="outline">{ action.name }</Badge>)) }</>
              }
            </TableCell>
            <TableCell><Badge variant="secondary">{ action.status }</Badge></TableCell>
            <TableCell>{ action.assignee ? formatUser(action.assignee) : "" }</TableCell>
            <TableCell>{ action.memo }</TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table>
  </>)
}
