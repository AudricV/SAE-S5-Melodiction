import { useEffect } from 'react';
import { useMelodyStore } from '../../store/melodyStore';
import TextScreen from '../../components/TextScreen';
import { Box, CssBaseline, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useManageMelody } from '../../hooks/manage_melody_item';
import UserInput from '../../components/UserInput';
import { useManageMusic } from '../../hooks/manage_music';
import MelodiesStorage from "../../data/storage/melodies_storage";
import EffectsItems from '../../components/Effects';
import { useManageMusicEffectsButtons } from '../../hooks/manage_music_effects_buttons';

export type MelodyPageProps = {
    melodiesStorage: MelodiesStorage
}

const MelodyPage = ({ melodiesStorage }: MelodyPageProps) => {
    const { selectedMelody } = useMelodyStore();
    const { handleMelodySaved } = useManageMelody(melodiesStorage);
    const {
        selectedMelodyIndex,
        handleEditClick,
        handleTextChange,
        handlePlayMusic,
        handleStopMusic
    } = useManageMusic(melodiesStorage);

    const { chorusEffect,
        tremoloEffect,
        reverbEffect,
        filterEffect,
        distortionEffect,
        synthType,
        handheSynthChange,
        handleChorusFrequencyChange,
        handleChorusDelayTimeChange,
        handleChorusDepthChange,
        handleTremoloFrequencyChange,
        handleTremoloDepthChange,
        handleReverbDecayChange,
        handleFilterFrequencyChange,
        handleFilterRolloffChange,
        handleDistortionValueChange,
        handleResetEffects
    } = useManageMusicEffectsButtons();

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
            {selectedMelody ?
                <>
                    <Stack paddingTop={5} paddingBottom={10} paddingLeft={10} paddingRight={10} style={{ flex: 1, width: '100%' }}>
                        <TextScreen
                            melody={selectedMelody}
                            onEditClick={handleEditClick}
                            onTextChange={() => handleMelodySaved(selectedMelodyIndex ?? -1, selectedMelody)}
                            onMusicPlay={() => handlePlayMusic()}
                            onMusicStop={() => handleStopMusic()} />

                    </Stack>
                    <Box sx={{ display: 'flex', bottom: '0', position: 'absolute', alignContent: 'center', flexDirection: 'column' }}>
                        <EffectsItems melody={selectedMelody} indexMelody={selectedMelodyIndex ?? -1} handheSynthChange={handheSynthChange}
                            handleChorusDelayTimeChange={handleChorusDelayTimeChange}
                            handleChorusDepthChange={handleChorusDepthChange}
                            handleChorusFrequencyChange={handleChorusFrequencyChange}
                            handleTremoloDepthChange={handleTremoloDepthChange}
                            handleTremoloFrequencyChange={handleTremoloFrequencyChange}
                            handleReverbDecayChange={handleReverbDecayChange}
                            handleFilterFrequencyChange={handleFilterFrequencyChange}
                            handleFilterRolloffChange={handleFilterRolloffChange}
                            handleDistortionValueChange={handleDistortionValueChange}
                            handleResetEffects={handleResetEffects}
                        />
                        <UserInput onSendMessage={handleTextChange} />
                    </Box>
                </>
                :
                <p>Chargement de la mélodie&nbsp;&ellip;</p>
            }
        </Box>
    );
}

export default MelodyPage;
