# Vivaldi

A browser-based React Flow starter using React, TypeScript, and Vite, adapted from the [official React Flow Vite template](https://github.com/xyflow/vite-react-flow-template) linked in the [Quick Start guide](https://reactflow.dev/learn).

## Run locally

Use Node.js 22.12+ (or `nvm use`), then:

```sh
npm install
npm start
```

Open the local URL printed by Vite. `npm run dev` also starts the development server.

## Working with the flow

- Drag nodes to move them. The “drag me!” node displays its current coordinates.
- Drag from an output handle to an input handle to connect nodes.
- Select nodes or edges and press Backspace to delete them.
- Pan the canvas, zoom with the controls, or navigate using the minimap.

Changes are held in memory and reset when you reload the page.

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

The build includes TypeScript checking and writes the production site to `dist/`.

## Structure

- `src/App.tsx`: flow state, connection handling, and canvas controls.
- `src/nodes/`: initial nodes, custom position node, and node types.
- `src/edges/`: initial edges and edge types.
- `src/main.tsx` and `src/index.css`: browser entry point and full-height layout.

The Electron runtime and Docker image listing have been removed. No Docker daemon is required.
