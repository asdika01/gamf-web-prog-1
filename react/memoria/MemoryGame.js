import React, { useState } from 'react';

const eredetiKartyak = ['🍎', '🍌', '🍒', '🍇', '🥝', '🍍', '🍓', '🍉'];

function keveres(lista) {
  return [...lista, ...lista].sort(() => 0.5 - Math.random()).map((val, i) => ({
    id: i,
    value: val,
    flipped: false,
    matched: false
  }));
}

export default function MemoryGame() {
  const [kartyak, setKartyak] = useState(keveres(eredetiKartyak));
  const [forditottak, setForditottak] = useState([]);

  function kattintas(i) {
    if (kartyak[i].flipped || kartyak[i].matched || forditottak.length === 2) return;

    const ujKartyak = [...kartyak];
    ujKartyak[i].flipped = true;
    const ujFord = [...forditottak, i];

    setKartyak(ujKartyak);
    setForditottak(ujFord);

    if (ujFord.length === 2) {
      const [elso, masodik] = ujFord;
      if (ujKartyak[elso].value === ujKartyak[masodik].value) {
        setTimeout(() => {
          const masolt = [...ujKartyak];
          masolt[elso].matched = true;
          masolt[masodik].matched = true;
          setKartyak(masolt);
          setForditottak([]);
        }, 1000);
      } else {
        setTimeout(() => {
          const vissza = [...ujKartyak];
          vissza[elso].flipped = false;
          vissza[masodik].flipped = false;
          setKartyak(vissza);
          setForditottak([]);
        }, 1000);
      }
    }
  }

  function ujraindit() {
    setKartyak(keveres(eredetiKartyak));
    setForditottak([]);
  }

  return React.createElement(
    'div',
    null,
    React.createElement('h2', null, 'Memóriajáték (8 pár)'),
    React.createElement('button', { onClick: ujraindit }, 'Újrakezdés'),
    React.createElement(
      'div',
      {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 60px)',
          gap: '10px',
          marginTop: '20px'
        }
      },
      kartyak.map((kartya, i) =>
        React.createElement(
          'div',
          {
            key: kartya.id,
            onClick: () => kattintas(i),
            style: {
              width: '60px',
              height: '60px',
              backgroundColor: kartya.matched || kartya.flipped ? '#fff' : '#888',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              cursor: 'pointer',
              border: '1px solid #333'
            }
          },
          kartya.flipped || kartya.matched ? kartya.value : ''
        )
      )
    )
  );
}
