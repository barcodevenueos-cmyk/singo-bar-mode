import React from 'react';

const MusicalNotes = () => {
  const notes = ['♪', '♫', '♬', '♩', '♪', '♫', '♬', '♩', '♪'];
  
  return (
    <div className="musical-notes">
      {notes.map((note, index) => (
        <div 
          key={index} 
          className="note"
          style={{
            animationDelay: `${index * 1.5}s`,
            fontSize: `${1.5 + Math.random() * 1.5}rem`
          }}
        >
          {note}
        </div>
      ))}
    </div>
  );
};

export default MusicalNotes;