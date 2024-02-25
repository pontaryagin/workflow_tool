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
import { getWorkflow, User, Workflow, Action, updateAction, findManyUser, updateActionToDone, WorkflowMin } from "@/lib/model"
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

const TIME_FORMAT = "yyyy-MM-dd HH:mm:ss"

export function DialogNewWorkflow() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" className="col-span-3" />
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
              className="col-span-3" ></AsyncSelect>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
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
