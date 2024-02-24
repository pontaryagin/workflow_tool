import dagre from '@dagrejs/dagre'
import {
  Node,
  Edge,
} from 'reactflow'
import { Workflow } from '@/lib/model'

export const getGraph = (nodes_: Node[], edges: Edge[], isHorizontal: boolean, nodeWidth = 1, nodeHeight = 1) => {
  const direction = isHorizontal ? 'LR' : 'TB'
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({ rankdir: direction })

  nodes_.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })
  dagre.layout(dagreGraph)
  return dagreGraph
}

export const getActionGraph = (workflow: Workflow) => {
  const nodes = workflow.actions.map(action => ({
    id: action.id.toString(),
    data: { label: action.name },
    position: { x: 0, y: 0 },
  }))
  const edges = workflow.actions.map(action =>
    action.parents.map(
      parent_action => ({
        id: `${action.id}-${parent_action.id}`,
        source: parent_action.id.toString(),
        target: action.id.toString(),
      })
    )
  ).flat()
  return { nodes, edges }
}
