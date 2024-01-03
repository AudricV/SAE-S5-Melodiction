import React, { useEffect, useState } from 'react';
import { useMelodyStore } from '../../store/melodyStore';
import TextScreen from '../../components/TextScreen';
import { Box, CssBaseline, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useManageMelody } from '../../tools/manageMelody';
import { SoundPlaybackManager } from '../../tools/sound_playback_manager';
import UserInput from '../../components/UserInput';

const MelodyPage: React.FC = () => {
    const { selectedMelody, setSelectedMelody } = useMelodyStore();
    const soundPlaybackManager = new SoundPlaybackManager();
    const { melodiesStorage, handleMelodySaved } = useManageMelody();

    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect((): void => {
        if (!selectedMelody) {
            console.log("No melody selected");
            navigate('/');
        }
    }, [selectedMelody, navigate]);

    const handleEditClick = () => {
        if (isEditing == false) {
            setIsEditing(true);
        }
        else {
            if (selectedMelody?.getMelodyText().trim() === "") {
                alert("Veuillez saisir un message valide");
                return;
            }
            setIsEditing(false);
        }
    };

    const handleTextChange = (text: string) => {
        text = selectedMelody?.getMelodyText() + text;
        const newMelody = selectedMelody;
        newMelody?.setMelodyText(text);
        setSelectedMelody(newMelody);
        soundPlaybackManager.playText(text, 0.25);
    };

    const handlePlayMusic = () => {
        if (selectedMelody && !isPlaying) {
            setIsPlaying(true);
            soundPlaybackManager.playText(selectedMelody.getMelodyText(), 0.25);
            console.log("Playing music");
        }
    }

    // It doesn't stop properly. 
    // I have the feeling that when you start the player the sound is beeing loaded for some moments.
    const handleStopMusic = () => {
        if (isPlaying) {
            setIsPlaying(false);
            soundPlaybackManager.stopPlayback();
            console.log("Stopping music");
        }
    }

    const selectedMelodyIndex = melodiesStorage.getMelodiesList()?.findIndex(m => m.getId() === selectedMelody?.getId());

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CssBaseline />

            <Stack paddingTop={5} paddingBottom={10} paddingLeft={10} paddingRight={10} style={{ flex: 1, width: '100%' }}>
                {selectedMelody ? <TextScreen
                    melody={selectedMelody}
                    onEditClick={handleEditClick}
                    onTextChange={() => handleMelodySaved(selectedMelodyIndex ?? -1, selectedMelody)}
                    onMusicPlay={() => { handlePlayMusic(); }}
                    onMusicStop={() => { handleStopMusic(); }}
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
