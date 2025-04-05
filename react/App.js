import React, { useState } from 'react';
import GridPainter from './szinezo/GridPainter.js';
import MemoryGame from './memoria/MemoryGame.js';

export default function App() {
  const [view, setView] = useState('painter');

  return React.createElement(
    'div',
    { style: { fontFamily: 'sans-serif', padding: '20px' } },
    React.createElement('h1', null, 'React SPA - Két Alkalmazás'),
    React.createElement(
      'div',
      { style: { marginBottom: '20px' } },
      React.createElement('button', { onClick: () => setView('painter'), style: { marginRight: '10px' } }, 'Színező rács'),
      React.createElement('button', { onClick: () => setView('memory') }, 'Memóriajáték')
    ),
    view === 'painter' ? React.createElement(GridPainter) : React.createElement(MemoryGame)
  );
}
