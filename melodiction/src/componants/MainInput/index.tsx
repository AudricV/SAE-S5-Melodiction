import React, { useState, CSSProperties } from 'react';

import "@fontsource/poppins"; // Defaults to weight 400

//Le composant à 100% dans la case où il est placé

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  fontFamily: "Poppins",
  border: '1px solid #ccc',
  borderRadius: '10px',
};

function MyTextField() {
  const [text, setText] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div style={{ margin: '20px' }}>
      <input
        type="text"
        placeholder="Saisissez votre message à transformer !"
        value={text}
        onChange={handleChange}
        style={inputStyle}
      />
    </div>
  );
}

export default MyTextField;
