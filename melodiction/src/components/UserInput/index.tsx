import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const UserInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} >
      <TextField
        label="Your message"
        variant="outlined"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        style={{ width: '100%', marginRight: '8px' }}
      />
      {message ?
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
        :
        <Button variant="contained" color="primary" disabled>
          Send
        </Button>
      }
    </div>
  );
};

export default UserInput;
