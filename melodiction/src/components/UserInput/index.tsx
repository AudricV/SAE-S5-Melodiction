import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

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
    <TextField
        label="Votre message"
        variant="outlined"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        style={{ display: 'flex', width: '100%' }}
        InputProps={{
          endAdornment: (
            <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={!message.trim()}>
              <SendIcon />
            </Button>
          ),
        }}
      />
  );
};

export default UserInput;
