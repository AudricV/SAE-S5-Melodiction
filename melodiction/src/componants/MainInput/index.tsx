import React, { useState } from 'react';
import "@fontsource/poppins"; // Defaults to weight 400
import { Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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

interface ButtonMyTextFieldProps {
  onButtonClick: () => void;
}

export function ButtonMyTextField({ onButtonClick }: ButtonMyTextFieldProps) {
  return (
    <Tooltip title="Transformer le texte !" arrow>
      <button
        style={{
          cursor: 'pointer',
          position: 'absolute',
          top: '50%',
          right: '1rem',
          transform: 'translateY(-50%)', // center the button vertically
          fontSize: '1rem',
          fontFamily: "Poppins",
          border: '0.1rem solid #ccc',
          borderRadius: '0.7rem',
        }}
        onClick={onButtonClick}
      >
        <SendIcon style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}/>
      </button>
    </Tooltip>
  );
}

function MyTextField({ onTextChange }: MyTextFieldProps) {
  const [text, setText] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
  };

  const handleButtonClick = () => {
    onTextChange(text);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Tooltip title="Saisissez votre message à transformer !" arrow>
        <input
          type="text"
          placeholder="Saisissez votre message à transformer !"
          value={text}
          onChange={handleChange}
          style={{ ...inputStyle, paddingRight: '4rem' }} // add padding to prevent text from being hidden by the button
        />
      </Tooltip>
      <ButtonMyTextField
        onButtonClick={handleButtonClick}
      />
    </div>
  );
}

export default MyTextField;