import React, { useState } from 'react';
import "@fontsource/poppins"; // Defaults to weight 400

interface MyTextFieldProps {
  onTextChange: (text: string) => void;
}

const inputStyle = {
  padding: '1rem',
  fontSize: '1rem',
  fontFamily: "Poppins",
  border: '0.3rem solid #ccc',
  borderRadius: '0.7rem',
};

function MyTextField({ onTextChange }: MyTextFieldProps) {
  const [text, setText] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
    onTextChange(newText);
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
