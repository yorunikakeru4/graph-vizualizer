import React, { useMemo, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Edge as RFEdge,
  useReactFlow,
} from "reactflow";
import CenterCircleNode from "./CenterCircleNode";
import "reactflow/dist/style.css";

const colorPalette = [
  "#f44336", "#2196f3", "#4caf50", "#ffeb3b", "#ff9800",
  "#9c27b0", "#00bcd4", "#8bc34a", "#e91e63", "#795548", "#607d8b"
];
const edgePalette = [
  "#00c853", "#d50000", "#2962ff", "#ffab00", "#aa00ff", "#00bfae", "#c51162", "#304ffe"
];

// Логарифмический масштаб радиуса
export function getDynamicRadius(vertices: number, edges: number) {
  if (vertices <= 1) return 180;
  const base = 180;
  const scale = 60;
  return base + scale * Math.log2(vertices);
}

// КОРРЕКТНОЕ размещение по кругу!
export function getNodePosition(idx: number, total: number, radius?: number, centerX = 350, centerY = 250) {
  if (!Number.isFinite(idx) || !Number.isFinite(total) || total <= 0 || idx < 0 || idx >= total) {
    return { x: centerX, y: centerY };
  }
  const r = typeof radius === "number" ? radius : getDynamicRadius(total, 0);
  if (total === 1) return { x: centerX, y: centerY };
  // угол = (2 * Math.PI * idx) / total - Math.PI/2
  const angle = (2 * Math.PI * idx) / total - Math.PI / 2;
  return {
    x: centerX + r * Math.cos(angle) - 24,
    y: centerY + r * Math.sin(angle) - 24,
  };
}

const nodeTypes = { centerCircle: CenterCircleNode };

const GraphCanvas = ({
  graph,
  nodes,
  setNodes,
  highlightEdges = [],
  edgeColoring = [],
  animStep,
  onNodesChange,
}) => {
  const edges: RFEdge[] = useMemo(() => {
    return graph.edges.map((e, idx) => {
      const key = [e.from, e.to].sort((a, b) => a - b).join("-");
      const highlighted = highlightEdges.some(([a, b]) =>
        (a === e.from && b === e.to) || (a === e.to && b === e.from)
      );

      let edgeColor = "#1976d2";
      if (edgeColoring.length > 0) {
        const found = edgeColoring.find(
          ([a, b]) =>
            (a === e.from && b === e.to) ||
            (a === e.to && b === a)
        );
        if (found) {
          edgeColor = edgePalette[(found[2] - 1) % edgePalette.length];
        }
      }

      return {
        id: key + idx,
        source: e.from.toString(),
        target: e.to.toString(),
        sourceHandle: "center",
        targetHandle: "center",
        label: graph.isWeighted && e.weight ? `${e.weight}` : "",
        animated: highlighted,
        type: "straight",
        style: highlighted
          ? { stroke: "#ff9800", strokeWidth: 4 }
          : { stroke: edgeColor, strokeWidth: 3 },
      };
    });
  }, [graph.edges, graph.isWeighted, highlightEdges, edgeColoring]);

  // fitView только при первом рендере (чтобы drag не сбрасывался!)
  const reactFlowInstance = useReactFlow();
  const firstFit = useRef(true);
  useEffect(() => {
    if (firstFit.current) {
      reactFlowInstance.fitView({ padding: 0.18, includeHiddenNodes: true });
      firstFit.current = false;
    }
  }, [reactFlowInstance]);

  return (
    <div style={{ height: 600, minWidth: 900, background: "#f7fbfc", borderRadius: 14 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView={false}
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnDoubleClick
        nodesDraggable
        elementsSelectable={false}
        nodesConnectable={false}
        onNodesChange={onNodesChange}
      >
        <MiniMap nodeColor="#90caf9" />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;
