import React, { useEffect } from 'react';
import { useMelodyStore } from '../../store/melodyStore';
import TextScreen from '../../components/TextScreen';
import { Box, CssBaseline, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {useManageMelody} from '../../hooks/manage_melody_item';
import UserInput from '../../components/UserInput';
import {useManageMusic} from '../../hooks/manage_music';

const MelodyPage: React.FC = () => {
    const { selectedMelody } = useMelodyStore();
    const { handleMelodySaved } = useManageMelody();
    const { selectedMelodyIndex, handleEditClick, handleTextChange, handlePlayMusic, handleStopMusic } = useManageMusic();

    const navigate = useNavigate();

    useEffect((): void => {
        if (!selectedMelody) {
            console.log("No melody selected. Redirecting to the landing page.");
            navigate('/');
        }
    }, [selectedMelody, navigate]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CssBaseline />

            <Stack paddingTop={5} paddingBottom={10} paddingLeft={10} paddingRight={10} style={{ flex: 1, width: '100%' }}>
                {selectedMelody ? <TextScreen
                    melody={selectedMelody}
                    onEditClick={handleEditClick}
                    onTextChange={() => handleMelodySaved(selectedMelodyIndex ?? -1, selectedMelody)}
                    onMusicPlay={() => handlePlayMusic()}
                    onMusicStop={() => handleStopMusic()}
                />
                    :
                    <div>Chargement de la mélodie...</div>
                }
            </Stack>

            <UserInput onSendMessage={handleTextChange} />
        </Box>
    );
}

export default MelodyPage;
