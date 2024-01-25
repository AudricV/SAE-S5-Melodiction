import { useState } from "react";
import { useMelodyStore } from "../store/melodyStore";
import MelodiesStorage from "../data/storage/melodies_storage";
import { useAudioStore } from "../store/effectsStore";
import Melody from "../data/melody";

export const tempo: number = 0.16;

export const useManageMusic = (melodiesStorage: MelodiesStorage) => {
    const { selectedMelody, setSelectedMelody } = useMelodyStore();

    const [isEditing, setIsEditing] = useState(false);

    const { synthType, soundPlaybackManager } = useAudioStore();

    /**
     * Event handler when clicking the edit button.
     *
     * @returns true if the melody has been edited, false otherwise
     */
    const handleEditClick = () => {
        if (isEditing) {
            if (selectedMelody == null) {
                return;
            }

            if (selectedMelody.getMelodyText().trim() === "") {
                // TODO: better error handling
                alert("Veuillez saisir un message valide");
                return;
            }
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleTextChange = (text: string) => {
        if (selectedMelody == null) {
            return;
        }

        setSelectedMelody(new Melody(
            selectedMelody.getId(),
            selectedMelody.getName(),
            selectedMelody.getMelodyText() + text,
            selectedMelody.getLastModifiedTimestamp(),
            selectedMelody.getEffects()));
    };

    const handlePlayMusic = () => {
        if (selectedMelody) {
            soundPlaybackManager.setSelectedSynth(synthType);
            // TODO: try to not apply effects each time the play button is pressed
            //  This change requires several refactors
            selectedMelody.getEffects().get(synthType)?.forEach(effect =>
                soundPlaybackManager.addOrReplaceSynthEffect(synthType, effect));
            soundPlaybackManager.playText(selectedMelody.getMelodyText(), tempo);
        }
    }

    const handleStopMusic = () => {
        soundPlaybackManager.stopPlayback();
    }

    const selectedMelodyIndex = melodiesStorage.getMelodiesList()?.findIndex(m => m.getId() === selectedMelody?.getId());

    return {
        handleEditClick,
        handleTextChange,
        handlePlayMusic,
        handleStopMusic,
        selectedMelodyIndex
    };
};
