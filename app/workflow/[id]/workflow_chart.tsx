'use client'
import React, { useCallback, useContext } from 'react'
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Connection,
} from 'reactflow'

import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Workflow } from '@/lib/model'
import { getActionGraph, getGraph } from '@/lib/graph'

type Direction = 'TB' | 'LR'

const nodeWidth = 172
const nodeHeight = 36

const getLayoutedElements = (nodes: Node[], edges: Edge[], isHorizontal: boolean) => {
  const dagreGraph = getGraph(nodes, edges, isHorizontal, nodeWidth, nodeHeight)

  let nodes_ = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    let targetPosition = isHorizontal ? 'left' : 'top'
    let sourcePosition = isHorizontal ? 'right' : 'bottom'

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }
    return { ...node, targetPosition, sourcePosition } as Node
  })
  return { nodes: nodes_, edges }
}

import { WorkflowContext } from "../../context"
import { get } from 'http'
export const WorkflowChart = () => {
  const [isHorizontal, setIsHorizontal] = React.useState<boolean>(false)
  const { workflow } = useContext(WorkflowContext)
  const { nodes: initialNodes, edges: initialEdges } = getActionGraph(workflow)
  let { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
    isHorizontal
  )
  const markerEnd = { type: MarkerType.ArrowClosed }
  layoutedEdges = layoutedEdges.map((edge) => {
    return {
      ...edge,
      markerEnd: markerEnd,
    }
  })
  return <div style={ { height: 700 } }>
    <ReactFlow
      nodes={ layoutedNodes }
      edges={ layoutedEdges }
      // onNodesChange={onNodesChange}
      // onEdgesChange={onEdgesChange}
      // onConnect={onConnect}
      connectionLineType={ ConnectionLineType.SmoothStep }
      fitView
      proOptions={ { hideAttribution: true } }
      draggable={ false }
      className='nowheel'
    >
      <Panel position="top-right">
        <Button variant="secondary" className='mx-1' onClick={ () => setIsHorizontal(false) }>vertical</Button>
        <Button variant="secondary" className='mx-1' onClick={ () => setIsHorizontal(true) }>horizontal</Button>
      </Panel>
    </ReactFlow>

  </div>
}
