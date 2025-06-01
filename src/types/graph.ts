export interface Edge {
  from: number;
  to: number;
  weight?: number;
}

export interface GraphData {
  vertices: number;
  edges: Edge[];
  isWeighted: boolean;
}
