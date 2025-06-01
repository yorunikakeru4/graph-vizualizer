import { Handle, NodeProps, Position } from "reactflow";

const colorPalette = [
  "#f44336", "#2196f3", "#4caf50", "#ffeb3b", "#ff9800",
  "#9c27b0", "#00bcd4", "#8bc34a", "#e91e63", "#795548", "#607d8b"
];

export default function CenterCircleNode({ data }: NodeProps) {
  const backgroundColor =
    data.colorIdx !== null && data.colorIdx !== undefined
      ? colorPalette[data.colorIdx]
      : data.isCurrent
        ? "#fff176"
        : "#90caf9";

  const borderColor = data.isCurrent ? "#f44336" : "#333";

  return (
    <div style={{ width: 48, height: 48, position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: backgroundColor,
          border: `2px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Top}
        id="center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          border: "none",
          width: 0,
          height: 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          border: "none",
          width: 0,
          height: 0,
        }}
      />
    </div>
  );
}
