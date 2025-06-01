# Graph Visualizer
// English version of the documentation for the Graph Visualizer project.
# Graph Visualizer

An interactive graph visualizer with manual editing, random/complete graph generation, and visualization of common algorithms.  
Built with React + TypeScript using [React Flow](https://reactflow.dev/) for interactive graph editing.

## Features

- Add/remove edges and vertices, assign weights to edges (weighted graph mode)
- Generate random graphs (no loops or duplicate edges)
- Quickly generate a complete graph
- Drag vertices freely with position persistence
- "Arrange in Circle" button — instantly distributes all vertices evenly on a circle
- Algorithm visualization:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Kruskal’s algorithm (minimum spanning tree)
  - Greedy vertex coloring
  - Greedy edge coloring
- Animation support (manual and automatic modes) for traversals
- Scrollable edge list panel for convenient editing of large graphs

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start development server:**
   ```bash
   npm start
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```

## Main components

- **GraphVisualizer.tsx** — main page component, includes controls, edge list, and visualization logic
- **EdgeListInput.tsx** — edge list editor
- **GraphCanvas.tsx** — React Flow-based canvas for displaying and interacting with the graph; supports drag, zoom, and circle arrangement
- **graph/algorithms/** — implementations of common graph algorithms

## Usage Tips

- After manually moving vertices, their positions persist. To return to the circle layout, use the "Arrange in Circle" button.
- To quickly create a large random graph, use the "Random Graph" button. No duplicates or loops are possible.
- To instantly make a complete graph, use the "Complete Graph" button.
- The visualization area supports mouse zoom and pan.

## Screenshot

![![Graph Visualizer Screenshot](https://i.imgur.com/8Z1k5bH.png)](https://i.imgur.com/8Z1k5bH.png)

## License

MIT



# Русская версия документации к проекту Graph Visualizer.

# Graph Visualizer

Визуализатор графов с поддержкой ручного ввода, генерации случайных и полных графов, а также алгоритмов обхода, раскраски и поиска минимального остовного дерева.  
Реализовано на React + TypeScript с использованием [React Flow](https://reactflow.dev/) для интерактивной работы с графами.

## Возможности

- Добавление/удаление рёбер и вершин, задание веса для рёбер (режим "взвешенный граф")
- Случайная генерация графа с гарантией отсутствия дубликатов и петель
- Быстрое создание полного графа
- Перетаскивание вершин мышью с сохранением их положения
- Кнопка "Выровнять по кругу" — размещает все вершины равномерно по окружности
- Визуализация алгоритмов:
  - Обход в ширину (BFS)
  - Обход в глубину (DFS)
  - Алгоритм Краскала (минимальное остовное дерево)
  - Жадная раскраска вершин
  - Жадная раскраска рёбер
- Поддержка анимации (ручной и автоматической) для обходов
- Панель со списком рёбер со скроллом для удобства работы с большими графами

## Как использовать

1. **Установка зависимостей:**
   ```bash
   npm install
   ```
2. **Запуск в режиме разработки:**
   ```bash
   npm start
   ```
3. **Сборка для продакшена:**
   ```bash
   npm run build
   ```

## Основные компоненты

- **GraphVisualizer.tsx** — главный компонент страницы, содержит меню управления, панель рёбер, визуализацию и анимацию.
- **EdgeListInput.tsx** — компонент для просмотра и редактирования списка рёбер.
- **GraphCanvas.tsx** — отображение графа на базе React Flow, реализует свободное перемещение вершин и "выравнивание по кругу".
- **graph/algorithms/** — реализация основных алгоритмов над графом.

## Советы по использованию

- После ручного перемещения вершин их позиции сохраняются. Для возвращения к круговой раскладке используйте кнопку "Выровнять по кругу".
- Для создания большого случайного графа используйте кнопку "Случайный граф". Гарантируется отсутствие петель и дубликатов рёбер.
- Для быстрого создания полного графа используйте кнопку "Полный граф".
- Область визуализации поддерживает масштабирование и перемещение мышью.

## Скриншоты
![![Graph Visualizer Screenshot](https://i.imgur.com/8Z1k5bH.png)](https://i.imgur.com/8Z1k5bH.png)
## Лицензия

MIT

