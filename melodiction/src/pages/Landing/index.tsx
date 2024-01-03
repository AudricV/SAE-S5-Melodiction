import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Paper, Stack } from '@mui/material';
import UserInput from '../../components/UserInput';
import { useManageMelody } from '../../tools/manageMelody';

function Landing() {
    const { addNewMelody } = useManageMelody();

    const handleTextChange = (text: string) => {
        addNewMelody(text);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CssBaseline />

            <Stack paddingTop={5} paddingBottom={10} paddingLeft={10} paddingRight={10} style={{ flex: 1, width: '100%' }}>
                <Paper sx={{ padding: "1rem", overflow: "auto" }}>
                    <div>Ecrivez...</div>
                </Paper>
            </Stack>

            <UserInput onSendMessage={handleTextChange} />
        </Box>
    );
}

export default Landing;
