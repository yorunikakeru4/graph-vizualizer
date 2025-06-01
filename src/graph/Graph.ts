import { Edge, GraphData } from "../types/graph";

export class Graph {
  vertices: number;
  edges: Edge[];
  isWeighted: boolean;

  constructor(data: GraphData) {
    this.vertices = data.vertices;
    this.edges = data.edges;
    this.isWeighted = data.isWeighted;
  }

  // adjacency list
  getAdjacencyList(): Record<number, number[]> {
    const adj: Record<number, number[]> = {};
    for (let i = 1; i <= this.vertices; i++) adj[i] = [];
    for (const { from, to } of this.edges) {
      adj[from].push(to);
      adj[to].push(from);
    }
    return adj;
  }
}
