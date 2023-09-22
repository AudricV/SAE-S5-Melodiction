import React, { useState, CSSProperties } from 'react';

import "@fontsource/poppins"; // Defaults to weight 400

const inputStyle: CSSProperties = {
  padding: '1rem',
  fontSize: '1rem',
  fontFamily: "Poppins",
  border: '0.3rem solid #ccc',
  borderRadius: '0.7rem',
};

function MyTextField() {
  const [text, setText] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div style={{ margin: '2rem' }}>
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
