import { Graph } from "../Graph";

export function bfs(graph: Graph, start: number): number[] {
  const visited: boolean[] = Array(graph.vertices + 1).fill(false);
  const order: number[] = [];
  const queue: number[] = [start];
  visited[start] = true;

  const adj = graph.getAdjacencyList();

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }

  return order;
}
