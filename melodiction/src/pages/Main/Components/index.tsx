import React, { useState } from 'react';
import MyTextField from '../../../componants/MainInput';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';


function PageMain(props: any) {
    const [inputText, setInputText] = useState<string>('');

    const handleTextChange = (text: string) => {
        setInputText(text);
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
                <Grid container spacing={3} paddingBottom={10} paddingLeft={10} paddingRight={10}>

                    <Grid item xs={12} md={12} marginTop={3}>
                        <Paper
                            sx={{
                                padding: '1rem',
                            }}
                        >
                            <p>
                                Texte entré: {inputText}
                            </p>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Paper
                            sx={{
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '1rem',
                                backgroundColor: 'transparent',
                                borderTop: '1px solid #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <MyTextField onTextChange={handleTextChange} />
                        </Paper>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    );
}

export default PageMain;
