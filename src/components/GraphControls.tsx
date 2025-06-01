import React from "react";
import { Button, ButtonGroup } from "@mui/material";

interface Props {
  onBFS: () => void;
  onDFS: () => void;
  onKruskal: () => void;
  onColor: () => void;
}

const GraphControls: React.FC<Props> = ({ onBFS, onDFS, onKruskal, onColor }) => (
  <ButtonGroup variant="contained" sx={{ mt: 2 }}>
    <Button onClick={onBFS}>Обход в ширину</Button>
    <Button onClick={onDFS}>Обход в глубину</Button>
    <Button onClick={onKruskal}>Краскал</Button>
    <Button onClick={onColor}>Окраска</Button>
  </ButtonGroup>
);

export default GraphControls;
