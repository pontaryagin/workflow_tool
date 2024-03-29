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
import { getWorkflow, User, Workflow, Action, updateAction, findManyUser, updateActionToDone } from "@/lib/model"
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
import { formatUser, loadUserList } from "@/lib/user"
import { startWorkflow } from "@/lib/model"


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
import { WorkflowContext } from "../../context"
import { Badge } from "@/components/ui/badge"
import { format } from "path"
import { start } from "repl"
import AsyncSelect from 'react-select/async'
import { Textarea } from "@/components/ui/textarea"

export const WorkflowTable = () => {
  const [isEditable, setIsEditable] = React.useState(false)
  const { workflow, setWorkflow, currentUser } = useContext(WorkflowContext)
  const onBlurName = async (e: ChangeEvent, action: Action) => {
    const name = e.target.value
    if (action.name === name) return
    const _ = await updateAction({
      where: {
        id: action.id,
      },
      data: {
        name,
      }
    })
    console.log(`Update name : ${action.name} => ${name}`)
    setWorkflow(await getWorkflow(workflow.id))
  }
  const onBlurMemo = async (e: React.FocusEvent<HTMLTextAreaElement>, action: Action) => {
    const memo = e.target.value
    if (action.memo === memo) return
    const _ = await updateAction({
      where: {
        id: action.id,
      },
      data: {
        memo,
      }
    })
    console.log(`Update memo : ${action.memo} => ${memo}`)
    setWorkflow(await getWorkflow(workflow.id))
  }
  const onChangeParents = async (values: readonly { value: number, label: string }[], action: Action) => {
    const _ = await updateAction({
      where: {
        id: action.id
      },
      data: {
        parents: {
          set: [],
          connect: values.map((v) => ({ id: v.value }))
        }
      }
    })
    setWorkflow(await getWorkflow(workflow.id))
  }
  const onClickDone = async (action: Action) => {
    console.log("Market as done an action : ", action.name)
    updateActionToDone(action.id)
    setWorkflow(await getWorkflow(workflow.id))
  }
  const isActionEditable = (action: Action) => {
    return ["ToDo", "InProgress"].includes(action.status)
  }
  return (<>
    <div className="flex justify-end mb-1">
      <Button onClick={ () => { startWorkflow(workflow.id) } } variant={ isEditable ? "outline" : "default" }
        className="text-xs size-fit mx-1">
        Start
      </Button>
      <Button onClick={ () => { setIsEditable(!isEditable) } } variant={ isEditable ? "outline" : "default" }
        className="text-xs size-fit mx-1">
        Edit
      </Button>
    </div>
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
            <TableCell className="min-w-[8rem]">
              { isEditable && isActionEditable(action)
                ? <Input defaultValue={ action.name }
                  onBlur={ (e) => onBlurName(e, action) } />
                : action.name
              }
            </TableCell>
            <TableCell className="min-w-[12rem]">
              { isEditable && isActionEditable(action)
                ? <Select
                  defaultValue={ action.parents.map(parent => ({ value: parent.id, label: parent.name })) }
                  isMulti
                  options={ workflow.actions.map(action => ({ value: action.id, label: action.name })) }
                  onChange={ (e) => onChangeParents(e, action) }
                />
                : <>{ action.parents.map(
                  action => (<Badge key={ action.id } variant="outline">
                    { action.name }
                  </Badge>)
                ) }</>
              }
            </TableCell>
            <TableCell><Badge variant="secondary">{ action.status }</Badge></TableCell>
            <TableCell className="min-w-[12rem]">
              { isEditable && isActionEditable(action)
                ? <AsyncSelect
                  defaultValue={ { value: action.assignee.id, label: formatUser(action.assignee) } }
                  defaultOptions
                  loadOptions={ loadUserList }
                />
                : <div className="text-sm">{ formatUser(action.assignee) }</div>
              }
            </TableCell>
            <TableCell className="whitespace-pre-wrap min-w-[9rem]">
              { isEditable
                ? <Textarea defaultValue={ action.memo }
                  onBlur={ (e) => onBlurMemo(e, action) } />
                : action.memo
              }
            </TableCell>
            <TableCell>
              { action.assignee.id === currentUser.id && action.status === "InProgress"
                ? < Button variant="default" onClick={ () => onClickDone(action) } className="size-7">🗸</Button>
                : null
              }
            </TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table >
  </>)
}
