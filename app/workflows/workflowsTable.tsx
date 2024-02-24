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

export const WorkflowsTable = ({ workflows }: { workflows: WorkflowMin[] }) => {
  return <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
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
          </TableRow>
        )) }
      </TableBody>
    </Table >
  </>
}
