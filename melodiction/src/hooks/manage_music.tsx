import { useState } from "react";
import { useMelodyStore } from "../store/melodyStore";
import MelodiesStorage from "../data/storage/melodies_storage";
import { useAudioStore } from "../store/effectsStore";

export const useManageMusic = (melodiesStorage: MelodiesStorage) => {
    const { selectedMelody, setSelectedMelody } = useMelodyStore();

    const [isEditing, setIsEditing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

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

    /**
     * Add a new melody to the list of melodies.
     *
     * @param text the text of the melody
     * @returns true if the melody has been added, false otherwise
     */
    const handleTextChange = (text: string) => {
        text = selectedMelody?.getMelodyText() + text;
        const newMelody = selectedMelody;
        newMelody?.setMelodyText(text);
        setSelectedMelody(newMelody);
        soundPlaybackManager.playText(text, 0.25);
    };

    /**
     * Add a new melody to the list of melodies.
     *
     * @returns true if the melody has been added, false otherwise
     */
    const handlePlayMusic = () => {
        if (selectedMelody && !isPlaying) {
            setIsPlaying(true);
            soundPlaybackManager.setSelectedSynth(synthType);
            soundPlaybackManager.playText(selectedMelody.getMelodyText(), 0.25);
            console.debug("Playing music");
            setTimeout(() => {
                console.debug("Stopping music");
                setIsPlaying(false);
            }, selectedMelody.getMelodyText().length * 0.50 * 1000);
        }
    }

    /**
     * Stop the music if it is playing.
     */
    const handleStopMusic = () => {
        if (isPlaying) {
            setIsPlaying(false);
            // FIXME: Playback doesn't stop properly currently: it seems that when the player is
            //  started, the sound is being loaded for a moment. Then, when it is stopped, the
            //  sound is still playing for the loaded time.
            soundPlaybackManager.stopPlayback();
            console.debug("Stopping music");
        }
    }

    // Get the index of the selected melody in the list of melodies
    const selectedMelodyIndex = melodiesStorage.getMelodiesList()?.findIndex(m => m.getId() === selectedMelody?.getId());

    return {
        handleEditClick,
        handleTextChange,
        handlePlayMusic,
        handleStopMusic,
        selectedMelodyIndex
    };
};
