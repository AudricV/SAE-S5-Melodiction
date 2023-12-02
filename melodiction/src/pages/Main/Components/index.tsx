import { useState, useEffect } from 'react';
import MyTextField from '../../../componants/MainInput';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { Stack } from '@mui/material';
import { SoundPlaybackManager } from '../../../tools/sound_playback_manager';
import Melody from '../../../data/melody';
import LocalMelodiesStorage from '../../../data/storage/impl/local_melodies_storage';
import { useMelodyContext } from '../../../context/melodyContetxt';

function PageMain() {
    const { selectedMelodyFromContext } = useMelodyContext();
    const id : String = selectedMelodyFromContext?.getId() || ''; 
    const melodiesStorage = new LocalMelodiesStorage();
    
    const [inputText, setInputText] = useState<string>('');
    const soundPlaybackManager = new SoundPlaybackManager();

    useEffect(() => {
        if (id) {
            const melody = melodiesStorage.getMelodiesList()?.find(m => m.getId() === id);
            setInputText(melody?.getMelodyText() || '');
        }
    }, [id]);

    const handleTextChange = (text: string) => {
        const newMelodyText = `${inputText} ${text}`;
        setInputText(newMelodyText);
        soundPlaybackManager.playText(text, 0.25);

        if (id) {
            const melody = melodiesStorage.getMelodiesList()?.find(m => m.getId() === id);
            const newMelody = new Melody(
                melody?.getId() || '',
                melody?.getName() || '',
                newMelodyText,
                melody?.getLastModifiedTimestamp() || 0
            );
            const index = melodiesStorage.getMelodiesList()?.findIndex(m => m.getId() === id);
            if (index !== -1 && index !== undefined) {
                melodiesStorage.updateMelody(index, newMelody);
            } else {
                console.error("No melody found for index " + index);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Stack spacing={3} paddingTop={5} paddingBottom={10} paddingLeft={10} paddingRight={10} height={'100%'} justifyContent={'space-between'}>
                    <Paper sx={{ padding: '1rem', overflow: 'auto' }}>
                        <p style={{ overflow: 'auto' }}>
                            Texte entré: {inputText}
                        </p>
                    </Paper>
                    <Paper
                        sx={{
                            position: 'fixed',
                            display: 'flex',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            padding: '1rem',
                            zIndex: 1000,
                        }}
                    >
                        <MyTextField onTextChange={handleTextChange} />
                    </Paper>
                </Stack>
            </Box>
        </Box>
    );
}

export default PageMain;
