import { Graph } from "../Graph";
import { Edge } from "../../types/graph";

class DisjointSet {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array(n + 1)
      .fill(0)
      .map((_, i) => i);
    this.rank = Array(n + 1).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number) {
    const rx = this.find(x),
      ry = this.find(y);
    if (rx === ry) return;
    if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
  }
}

export function kruskal(graph: Graph): Edge[] {
  const mst: Edge[] = [];
  const dsu = new DisjointSet(graph.vertices);
  const edges = [...graph.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
  for (const edge of edges) {
    const { from, to } = edge;
    if (dsu.find(from) !== dsu.find(to)) {
      mst.push(edge);
      dsu.union(from, to);
    }
  }
  return mst;
}
