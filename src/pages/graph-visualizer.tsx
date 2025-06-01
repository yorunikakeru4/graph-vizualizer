import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Container, Typography, Checkbox, FormControlLabel, Box, TextField,
  Button, ButtonGroup, RadioGroup, FormControl, FormLabel, Radio, Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReactFlowProvider, Node, applyNodeChanges, NodeChange } from "reactflow";
import EdgeListInput from "../components/EdgeListInput";
import GraphCanvas, { getNodePosition } from "../components/GraphCanvas";
import { Graph } from "../graph/Graph";
import { bfs } from "../graph/algorithms/bfs";
import { dfs } from "../graph/algorithms/dfs";
import { kruskal } from "../graph/algorithms/kruskal";
import { greedyVerticesColoring, greedyEdgeColoring } from "../graph/algorithms/coloring";
import { Edge } from "../types/graph";
import styles from "../styles/GraphVisualizer.module.css";

const ANIMATION_DELAY = 700;

function buildNodes(vertices: number, coloring: Record<number, number>, highlightNodes: number[], animStep?: number): Node[] {
  return Array.from({ length: vertices }, (_, i) => {
    const id = `${i + 1}`;
    return {
      id,
      data: {
        label: `В${id}`,
        colorIdx: coloring[i + 1] ? (coloring[i + 1] - 1) % 11 : null,
        isCurrent: animStep !== undefined && highlightNodes[0] === i + 1,
      },
      position: getNodePosition(i, vertices),
      type: "centerCircle",
      draggable: true,
    };
  });
}

const GraphVisualizer = () => {
  const [vertices, setVertices] = useState(2);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isWeighted, setIsWeighted] = useState(false);
  const [startNode, setStartNode] = useState(1);

  const [nodes, setNodes] = useState<Node[]>(() => buildNodes(2, {}, [], undefined));

  useEffect(() => {
    setNodes(prev => {
      const prevMap = Object.fromEntries(prev.map(n => [n.id, n]));
      const next: Node[] = [];
      for (let i = 1; i <= vertices; i++) {
        const id = `${i}`;
        if (prevMap[id]) {
          next.push(prevMap[id]);
        } else {
          next.push({
            id,
            data: { label: `В${id}` },
            position: getNodePosition(i - 1, vertices),
            type: "centerCircle",
            draggable: true,
          });
        }
      }
      return next;
    });
  }, [vertices]);

  useEffect(() => {
    setEdges(old => old.filter(e => e.from <= vertices && e.to <= vertices));
    setStartNode(s => Math.min(s, vertices));
  }, [vertices]);

  const [animOrder, setAnimOrder] = useState<number[]>([]);
  const [animStep, setAnimStep] = useState<number>(0);
  const [isAutoAnim, setIsAutoAnim] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const [highlightEdges, setHighlightEdges] = useState<[number, number][]>([]);
  const [edgeColoring, setEdgeColoring] = useState<[number, number, number][]>([]);
  const [coloring, setColoring] = useState<Record<number, number>>({});

  useEffect(() => {
    setNodes(prev =>
      prev.map((n) => ({
        ...n,
        data: {
          label: `В${n.id}`,
          colorIdx: coloring[Number(n.id)]
            ? (coloring[Number(n.id)] - 1) % 11
            : null,
          isCurrent:
            animStep !== undefined &&
            animOrder.length > 0 &&
            animOrder[animStep] === Number(n.id),
        },
      }))
    );
  }, [coloring, animOrder, animStep]);

  const graph = new Graph({ vertices, edges, isWeighted });

  const makeCompleteGraph = () => {
    const newEdges: Edge[] = [];
    for (let i = 1; i <= vertices; i++) {
      for (let j = i + 1; j <= vertices; j++) {
        if (
          !edges.some(
            (e) =>
              (e.from === i && e.to === j) || (e.from === j && e.to === i)
          )
        ) {
          newEdges.push({ from: i, to: j });
        }
      }
    }
    setEdges((curr) => [...curr, ...newEdges]);
  };

// Генерация случайного графа (случаное количество вершин, рёбер и если включён вес - вес)
  const makeRandomGraph = () => {
  const newVertices = Math.max(2, Math.min(50, Math.floor(Math.random() * 20) + 2));
  setVertices(newVertices);

  // Генерируем все возможные уникальные рёбра
  let allEdges: Edge[] = [];
  for (let i = 1; i <= newVertices; i++) {
    for (let j = i + 1; j <= newVertices; j++) {
      allEdges.push({ from: i, to: j });
    }
  }

  // Перемешиваем массив рёбер
  for (let i = allEdges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allEdges[i], allEdges[j]] = [allEdges[j], allEdges[i]];
  }

  // Определяем количество рёбер
  const maxEdges = allEdges.length;
  const edgeCount = Math.min(maxEdges, Math.floor(Math.random() * Math.min(30, maxEdges)) + 1);

  // Берём первые edgeCount рёбер
  const newEdges = allEdges.slice(0, edgeCount).map(e => (
    isWeighted
      ? { ...e, weight: Math.floor(Math.random() * 10) + 1 }
      : e
  ));

  setEdges(newEdges);
  setStartNode(1);
};
  const clearGraph = () => {
    setEdges([]);
    setAnimOrder([]);
    setAnimStep(0);
    setHighlightEdges([]);
    setEdgeColoring([]);
    setColoring({});
    setIsPlaying(false);
    setIsWeighted(false);
    setVertices(1);
  };

  const resetVisuals = () => {
    setAnimOrder([]);
    setAnimStep(0);
    setHighlightEdges([]);
    setEdgeColoring([]);
    setColoring({});
    setIsPlaying(false);
  };

  const arrangeCircle = () => {
    setNodes(prev =>
      prev.map((n, i, arr) => ({
        ...n,
        position: getNodePosition(i, arr.length),
      }))
    );
  };

  const handleBFS = () => {
    const order = bfs(graph, startNode);
    setAnimOrder(order);
    setAnimStep(0);
    setHighlightEdges([]);
    setEdgeColoring([]);
    setColoring({});
    setIsPlaying(false);
  };

  const handleDFS = () => {
    const order = dfs(graph, startNode);
    setAnimOrder(order);
    setAnimStep(0);
    setHighlightEdges([]);
    setEdgeColoring([]);
    setColoring({});
    setIsPlaying(false);
  };

  const handleKruskal = () => {
    setIsPlaying(false);
    if (!isWeighted) return;
    const mst = kruskal(graph);
    setHighlightEdges(mst.map(e => [e.from, e.to] as [number, number]));
    setAnimOrder([]);
    setEdgeColoring([]);
    setColoring({});
  };

  const handleColor = () => {
    setIsPlaying(false);
    const coloring = greedyVerticesColoring(graph);
    setColoring(coloring);
    setAnimOrder([]);
    setEdgeColoring([]);
    setHighlightEdges([]);
  };

  const handleEdgeColoring = () => {
    setIsPlaying(false);
    const colored = greedyEdgeColoring(edges, vertices);
    setEdgeColoring(colored);
    setHighlightEdges([]);
    setAnimOrder([]);
    setColoring({});
  };

  async function playAuto(order: number[]) {
    setIsPlaying(true);
    for (let i = 0; i < order.length; i++) {
      setAnimStep(i);
      await new Promise(r => setTimeout(r, ANIMATION_DELAY));
      if (!isPlayingRef.current) break;
    }
    setIsPlaying(false);
  }

  const canStepBack = animStep > 0;
  const canStepForward = animOrder.length > 0 && animStep < animOrder.length - 1;

  const handleGoMainMenu = () => {
    window.location.href = "/";
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(nds => applyNodeChanges(changes, nds));
    },
    []
  );

  return (
    <Container className={styles.root} maxWidth={false} sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {/* Левая панель: EdgeListInput со скроллом */}
      <Paper
        elevation={3}
        sx={{
          minWidth: 220,
          maxWidth: isWeighted ? 400 : 300,
          height: "calc(100vh - 32px)",
          mr: 3,
          mt: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
          Список рёбер
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 1,
            pt: 0,
            borderTop: "1px solid #eee"
          }}
        >
          <EdgeListInput
            edges={edges}
            setEdges={setEdges}
            isWeighted={isWeighted}
            vertices={vertices}
          />
        </Box>
      </Paper>

      {/* Основная панель */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoMainMenu}
          >
            Назад к главному меню
          </Button>
        </Box>
        <Typography variant="h4" className={styles.header}>Визуализация графа</Typography>

        <Box className={styles.topPanel}>
          <TextField
            label="Количество вершин"
            type="number"
            value={vertices}
            onChange={e => {
              const v = Math.max(1, Math.min(50, Number(e.target.value)));
              setVertices(v); 
            }}
            inputProps={{ min: 1, max: 50 }}
            className={styles.input}
          />
          <FormControlLabel
            control={
              <Checkbox checked={isWeighted} onChange={e => setIsWeighted(e.target.checked)} />
            }
            label="Взвешенный граф"
          />
          <TextField
            label="Стартовая вершина"
            type="number"
            value={startNode}
            onChange={e => setStartNode(Math.max(1, Math.min(vertices, Number(e.target.value))))}
            inputProps={{ min: 1, max: vertices }}
            className={styles.input}
          />
          <FormControl>
            <FormLabel>Анимация</FormLabel>
            <RadioGroup
              row
              value={isAutoAnim ? "auto" : "manual"}
              onChange={e => {
                setIsAutoAnim(e.target.value === "auto");
                setIsPlaying(false);
              }}
            >
              <FormControlLabel value="manual" control={<Radio />} label="Пошаговая" />
              <FormControlLabel value="auto" control={<Radio />} label="Автоматическая" />
            </RadioGroup>
          </FormControl>
          <Button variant="outlined" onClick={makeCompleteGraph} className={styles.completeButton}>
            Полный граф
          </Button>
          <Button variant="outlined" onClick={makeRandomGraph} className={styles.randomButton}>
            Случайный граф
          </Button>
          <Button variant="outlined" onClick={arrangeCircle}>
            Выровнять по кругу
          </Button>
          <Button variant="outlined" onClick={clearGraph} color="error">
            Очистить граф
          </Button>
        </Box>

        <ButtonGroup variant="contained" className={styles.buttonGroup}>
          <Button onClick={handleBFS}>Обход в ширину</Button>
          <Button onClick={handleDFS}>Обход в глубину</Button>
          <Button onClick={handleKruskal} disabled={!isWeighted}>Краскал (MST)</Button>
          <Button onClick={handleColor}>Окраска вершин</Button>
          <Button onClick={handleEdgeColoring}>Окраска рёбер</Button>
          <Button onClick={resetVisuals} color="inherit">Сбросить</Button>
        </ButtonGroup>

        {animOrder.length > 0 && (
          <Box className={styles.animControl}>
            <Typography>Анимация обхода</Typography>
            {isAutoAnim ? (
              <Button
                onClick={() => {
                  if (!isPlaying && animOrder.length > 0) playAuto(animOrder);
                  else setIsPlaying(false);
                }}
                variant="outlined"
                color={isPlaying ? "error" : "primary"}
                sx={{ mr: 2 }}
              >
                {isPlaying ? "Стоп" : "Запустить"}
              </Button>
            ) : (
              <ButtonGroup>
                <Button onClick={() => setAnimStep(s => Math.max(0, s - 1))} disabled={!canStepBack}>Назад</Button>
                <Button onClick={() => setAnimStep(s => Math.min(animOrder.length - 1, s + 1))} disabled={!canStepForward}>Вперёд</Button>
              </ButtonGroup>
            )}
            <Typography sx={{ ml: 2 }}>
              Текущий: {animOrder[animStep] ? `Вершина ${animOrder[animStep]}` : "-"}
            </Typography>
          </Box>
        )}

        <Box className={styles.graphArea} sx={{ mt: 2 }}>
          <ReactFlowProvider>
            <GraphCanvas
              graph={graph}
              nodes={nodes}
              setNodes={setNodes}
              highlightEdges={highlightEdges}
              edgeColoring={edgeColoring}
              animStep={animOrder.length > 0 ? animStep : undefined}
              onNodesChange={onNodesChange}
            />
          </ReactFlowProvider>
        </Box>

        
      </Box>
    </Container>
  );
};

export default GraphVisualizer;
