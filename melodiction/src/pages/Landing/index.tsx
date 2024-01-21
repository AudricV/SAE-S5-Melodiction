import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Stack, useTheme } from '@mui/material';
import UserInput from '../../components/UserInput';
import { useManageMelody } from '../../hooks/manage_melody_item';
// @ts-expect-error Usage of an image logo path in an import
import melodictionLogo from '/logo_Melodiction_en_cours.png';
import MelodiesStorage from "../../data/storage/melodies_storage";

export type LandingProps = {
    melodiesStorage: MelodiesStorage
}

function Landing({ melodiesStorage }: LandingProps) {
    const { handleAddNewMelody } = useManageMelody(melodiesStorage);
    const theme = useTheme();

    const handleTextChange = (text: string) => handleAddNewMelody(text);

    // Determine the logo color based on the theme
    const logoColor = theme.palette.mode === 'dark' ? 'white' : 'black';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CssBaseline />

            <Stack paddingTop={5} paddingBottom={10} paddingLeft={10} paddingRight={10} style={{ width: '100%' }}>
                <img
                    src={melodictionLogo}
                    alt="Description de l'image"
                    style={{ width: '10%', height: '10%', display: 'block', margin: 'auto', paddingTop: '100px', filter: `invert(${theme.palette.mode === 'dark' ? '100%' : '0%'})`, color: logoColor }}
                />
            </Stack>

            <Box sx={{ display: 'flex', bottom: '0', position: 'absolute', alignContent: 'center', flexDirection: 'column' }}>
                <UserInput onSendMessage={handleTextChange} />
            </Box>
        </Box>
    );
}

export default Landing;
