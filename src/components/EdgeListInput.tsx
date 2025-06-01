import React, { useState, useEffect } from "react";
import { Edge } from "../types/graph";
import { IconButton, TextField, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import styles from "../styles/GraphVisualizer.module.css";

interface Props {
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  isWeighted: boolean;
  vertices: number;
}

const EdgeListInput: React.FC<Props> = ({
  edges,
  setEdges,
  isWeighted,
  vertices,
}) => {
  // Для хранения ошибок по индексам рёбер
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Проверяем все рёбра на ошибки и обновляем errors
  useEffect(() => {
    const newErrors: Record<number, string> = {};

    const edgeKey = (a: number, b: number) =>
      [Math.min(a, b), Math.max(a, b)].toString();

    const seenEdges = new Set<string>();

    edges.forEach((edge, idx) => {
      const { from, to } = edge;

      // Проверка диапазона вершин
      if (
        from < 1 ||
        to < 1 ||
        from > vertices ||
        to > vertices
      ) {
        newErrors[idx] = "Вершина вне диапазона";
        return;
      }

      // Запрет петель
      if (from === to) {
        newErrors[idx] = "Петли запрещены";
        return;
      }

      const key = edgeKey(from, to);
      if (seenEdges.has(key)) {
        newErrors[idx] = "Дублирование ребра";
        return;
      }
      seenEdges.add(key);
    });

    setErrors(newErrors);
  }, [edges, vertices]);

  const handleChange = (idx: number, field: keyof Edge, value: string) => {
    const parsedValue = field === "weight" ? Number(value) : Number(value);
    const newEdges = [...edges];
    newEdges[idx] = {
      ...newEdges[idx],
      [field]: parsedValue,
    };
    setEdges(newEdges);
  };

  const addEdge = () => {
    // Максимальное число рёбер без повторов и петель
    const maxEdges = (vertices * (vertices - 1)) / 2;
    if (edges.length >= maxEdges) return;

    // Найдем первую свободную пару
    const edgeExists = (a: number, b: number) =>
      edges.some(
        (e) =>
          (e.from === a && e.to === b) || (e.from === b && e.to === a)
      );

    for (let i = 1; i <= vertices; i++) {
      for (let j = i + 1; j <= vertices; j++) {
        if (!edgeExists(i, j)) {
          setEdges([...edges, { from: i, to: j, weight: isWeighted ? 1 : undefined }]);
          return;
        }
      }
    }
  };

  return (
    <Paper className={styles.edgeInputBlock} elevation={2}>
      <div>
        {edges.map((edge, idx) => (
          <div key={idx} className={styles.edgeInputRow}>
            <TextField
              size="small"
              label="From"
              type="number"
              value={edge.from}
              onChange={(e) => handleChange(idx, "from", e.target.value)}
              inputProps={{ min: 1, max: vertices }}
              error={!!errors[idx]}
              helperText={errors[idx]}
              className={styles.edgeInputField}
            />
            <TextField
              size="small"
              label="To"
              type="number"
              value={edge.to}
              onChange={(e) => handleChange(idx, "to", e.target.value)}
              inputProps={{ min: 1, max: vertices }}
              error={!!errors[idx]}
              helperText={errors[idx]}
              className={styles.edgeInputField}
            />
            {isWeighted && (
              <TextField
                size="small"
                label="Вес"
                type="number"
                value={edge.weight ?? 1}
                onChange={(e) => handleChange(idx, "weight", e.target.value)}
                className={styles.edgeInputField}
              />
            )}
            <IconButton
              onClick={() => {
                setErrors((errs) => {
                  const copy = { ...errs };
                  delete copy[idx];
                  return copy;
                });
                setEdges(edges.filter((_, i) => i !== idx));
              }}
              size="small"
              color="error"
              aria-label="удалить ребро"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}

        <button
          type="button"
          onClick={addEdge}
          className={styles.addEdgeButton}
          disabled={Object.keys(errors).length > 0}
          title={
            Object.keys(errors).length > 0
              ? "Исправьте ошибки перед добавлением ребра"
              : ""
          }
        >
          <AddIcon fontSize="small" /> Добавить ребро
        </button>

        {Object.keys(errors).length > 0 && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            Исправьте ошибки в ребрах, чтобы добавить новое
          </Typography>
        )}
      </div>
    </Paper>
  );
};

export default EdgeListInput;

