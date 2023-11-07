import { useState } from 'react';
import MyTextField from '../../../componants/MainInput';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import { Stack } from '@mui/material';
import { SoundPlaybackManager } from '../../../tools/sound_playback_manager';


function PageMain(props: any) {
    const [inputText, setInputText] = useState<string>('');
    const soundPlaybackManager = new SoundPlaybackManager();

    const handleTextChange = (text: string) => {
        setInputText(text);
        // TODO: the note time is currently hardcoded, it should be passed by the user
        soundPlaybackManager.playText(text, 0.25);
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
                <Stack spacing={3} paddingBottom={10} paddingLeft={10} paddingRight={10} height={'100%'} justifyContent={'space-between'}>

                    <Paper
                        sx={{
                            padding: '1rem',
                        }}
                    >
                        <p>
                            Texte entré: {inputText}
                        </p>
                    </Paper>

                    <Paper
                        sx={{
                            display: 'flex',
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            padding: '1rem',
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
