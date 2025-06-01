import { Graph } from "../Graph";

export function dfs(graph: Graph, start: number): number[] {
  const visited: boolean[] = Array(graph.vertices + 1).fill(false);
  const order: number[] = [];
  const adj = graph.getAdjacencyList();

  function visit(v: number) {
    visited[v] = true;
    order.push(v);
    for (const u of adj[v]) {
      if (!visited[u]) visit(u);
    }
  }

  visit(start);
  return order;
}
