"use client"
type WorkflowProps = {
  username: string,
}

type Workflow = {
    actions: Action[],
}

type Action = {
    assigned_user: string,
    name: string,
    requirements: string[],
    status: string,
    memo: string,
}

const BASE_TASK: Workflow = {actions: [
  {assigned_user: "user1", name: "test", requirements: [], status: "Done", memo: ""},
  {assigned_user: "user1", name: "test2", requirements: ["test"], status: "InProgress", memo: "start"},
  {assigned_user: "user1", name: "test3", requirements: ["test", "test2"], status: "ToDo", memo: "start"},
]}

import React, { useCallback } from 'react'
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
import dagre from '@dagrejs/dagre'

import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 172
const nodeHeight = 36
type Direction = 'TB' | 'LR'

const getLayoutedElements = (nodes_:Node[], edges:Edge[], direction: Direction = 'TB') => {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes_.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })
  dagre.layout(dagreGraph)

  let nodes = nodes_.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    let targetPosition = isHorizontal ? 'left' : 'top'
    let sourcePosition = isHorizontal ? 'right' : 'bottom'

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }
    return {...node, targetPosition, sourcePosition} as Node
  })
  return { nodes, edges }
}

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input' },
    position: {x: 0, y: 0},
  },
  {
    id: '2',
    data: { label: 'node 2' },
    position: {x: 0, y: 0},
  },
  {
    id: '3',
    data: { label: 'node 3' },
    position: {x: 0, y: 0},
  },
]

const markerEnd = {type: MarkerType.ArrowClosed}

export const initialEdges: Edge[] = [
  { id: 'e12', source: '1', target: '2', markerEnd: markerEnd},
  { id: 'e3', source: '2', target: '3', markerEnd: markerEnd},
]

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
)

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  const onConnect  = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep}, eds))
    },
    []
  )
  const onLayout = useCallback(
    (direction:Direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      )

      setNodes([...layoutedNodes])
      setEdges([...layoutedEdges])
    },
    [nodes, edges]
  )

  return <div style={{ height: 700 }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
    >
      <Panel position="top-right">
        <Button variant="secondary" className='mx-1' onClick={() => onLayout('TB')}>vertical</Button>
        <Button variant="secondary" className='mx-1' onClick={() => onLayout('LR')}>horizontal</Button>
      </Panel>
    </ReactFlow>

  </div>
}

export const Workflow = ({username}: WorkflowProps) => {
  return (
    <div>
      <h1>Workflow</h1>
      <Flow/>
    </div>
  )
}
