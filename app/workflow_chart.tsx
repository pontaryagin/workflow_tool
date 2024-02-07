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
import dagre from '@dagrejs/dagre'

import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Workflow } from '@/app/model'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 172
const nodeHeight = 36
type Direction = 'TB' | 'LR'

const getLayoutedElements = (nodes_: Node[], edges: Edge[], isHorizontal: boolean = false) => {
  const direction = isHorizontal ? 'LR' : 'TB'
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
    return { ...node, targetPosition, sourcePosition } as Node
  })
  return { nodes, edges }
}

import { WorkflowContext } from "./context"
const markerEnd = { type: MarkerType.ArrowClosed }
export const WorkflowChart = () => {
  const [isHorizontal, setIsHorizontal] = React.useState<boolean>(false)
  const { workflow } = useContext(WorkflowContext)
  const initialNodes = workflow.actions.map(action => ({
    id: action.id.toString(),
    data: { label: action.name },
    position: { x: 0, y: 0 },
  }))
  const initialEdges = workflow.actions.map(action =>
    action.parents.map(
      parent_action => ({
        id: `${action.id}-${parent_action.id}`,
        source: parent_action.id.toString(),
        target: action.id.toString(), markerEnd: markerEnd
      })
    )
  ).flat()
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  )
  console.log("WorkflowChart")
  console.log("initialNodes: ", initialNodes)
  console.log("layoutedNodes: ", layoutedNodes)
  // console.log("nodes: ", nodes)
  // const onConnect = useCallback(
  //   (params: Connection) => {
  //     setEdges((eds) =>
  //       addEdge({ ...params, type: ConnectionLineType.SmoothStep }, eds))
  //   },
  //   []
  // )
  const onLayout = useCallback(
    (direction: Direction) => {
      const { nodes: layoutedNodes_, edges: layoutedEdges_ } = getLayoutedElements(
        layoutedNodes,
        layoutedEdges,
        isHorizontal
      )
    },
    [layoutedNodes, layoutedEdges, isHorizontal]
  )

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
    >
      <Panel position="top-right">
        <Button variant="secondary" className='mx-1' onClick={ () => setIsHorizontal(false) }>vertical</Button>
        <Button variant="secondary" className='mx-1' onClick={ () => setIsHorizontal(true) }>horizontal</Button>
      </Panel>
    </ReactFlow>

  </div>
}
