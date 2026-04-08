// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import KanbanBoard from './KanbanBoardJS.js'; 

// Find the Kanban feature box in the HTML
const kanbanContainer = document.getElementById('feature-kanban');

// Render the React component inside it
const root = createRoot(kanbanContainer);
root.render(React.createElement(KanbanBoard));
