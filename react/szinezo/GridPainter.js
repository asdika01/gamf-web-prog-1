import React, { useState } from 'react';

export default function GridPainter() {
  const meret = 40;
  const alapSzin = '#ffffff';
  const [valasztottSzin, setValasztottSzin] = useState('#ff0000');
  const [racs, setRacs] = useState(Array(meret * meret).fill(alapSzin));

  function szinezd(i) {
    const uj = [...racs];
    uj[i] = valasztottSzin;
    setRacs(uj);
  }

  function torol() {
    setRacs(Array(meret * meret).fill(alapSzin));
  }

  return React.createElement(
    'div',
    null,
    React.createElement('h2', null, 'Színező rács'),
    React.createElement('input', {
      type: 'color',
      value: valasztottSzin,
      onChange: e => setValasztottSzin(e.target.value),
      style: { marginBottom: '10px', marginRight: '10px' }
    }),
    React.createElement('button', { onClick: torol }, 'Reset'),
    React.createElement(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${meret}, 15px)`,
          gap: '1px',
          marginTop: '10px'
        }
      },
      racs.map((szin, i) =>
        React.createElement('div', {
          key: i,
          onClick: () => szinezd(i),
          style: {
            width: '15px',
            height: '15px',
            backgroundColor: szin,
            border: '1px solid #ddd',
            cursor: 'pointer'
          }
        })
      )
    )
  );
}
