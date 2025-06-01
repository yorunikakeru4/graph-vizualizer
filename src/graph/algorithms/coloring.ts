import { Graph } from "../Graph";

export function greedyVerticesColoring(graph: Graph): Record<number, number> {
  const colors: Record<number, number> = {};
  const adj = graph.getAdjacencyList();
  for (let v = 1; v <= graph.vertices; v++) {
    const used = new Set<number>();
    for (const u of adj[v]) if (colors[u]) used.add(colors[u]);
    let color = 1;
    while (used.has(color)) color++;
    colors[v] = color;
  }
  return colors;
}

// Минимальная раскраска рёбер — жадно, O(m*Δ)
export function greedyEdgeColoring(
  edges: { from: number; to: number }[],
  vertices: number
): [number, number, number][] {
  const edgeColors: [number, number, number][] = [];
  const used = Array.from({ length: vertices + 1 }, () => new Set<number>());
  for (const e of edges) {
    let color = 1;
    while (used[e.from].has(color) || used[e.to].has(color)) color++;
    edgeColors.push([e.from, e.to, color]);
    used[e.from].add(color);
    used[e.to].add(color);
  }
  return edgeColors;
}
