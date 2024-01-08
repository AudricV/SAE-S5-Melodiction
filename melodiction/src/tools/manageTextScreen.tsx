import { useState } from "react";
import { useMelodyStore } from "../store/melodyStore";
import { SoundPlaybackManager } from "./sound_playback_manager";
import { useManageMelody } from "./manageMelodyItem";

export const useManageMusic = () => {
    const { selectedMelody, setSelectedMelody } = useMelodyStore();
    const soundPlaybackManager = new SoundPlaybackManager();
    const { melodiesStorage } = useManageMelody();

    const [isEditing, setIsEditing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    /**
     * 
     * @returns true if the melody has been edited, false otherwise
     * @description Edit the melody
     */
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

    /**
     * 
     * @param text The text of the melody
     * @returns true if the melody has been added, false otherwise
     * @description Add a new melody to the list of melodies
     */
    const handleTextChange = (text: string) => {
        text = selectedMelody?.getMelodyText() + text;
        const newMelody = selectedMelody;
        newMelody?.setMelodyText(text);
        setSelectedMelody(newMelody);
        soundPlaybackManager.playText(text, 0.25);
    };

    /**
     * 
     * @returns true if the melody has been added, false otherwise
     * @description Add a new melody to the list of melodies
     */
    const handlePlayMusic = () => {
        if (selectedMelody && !isPlaying) {
            setIsPlaying(true);
            soundPlaybackManager.playText(selectedMelody.getMelodyText(), 0.25);
            console.log("Playing music");
            setIsPlaying(false);
        }
    }

    /**
     * 
     * @returns true if the melody has been added, false otherwise
     * @description Add a new melody to the list of melodies
     * It doesn't stop properly. 
     * I have the feeling that when you start the player, the sound is beeing loaded for some moments.
     * Then, when you stop it, the sound is still playing for the loaded time.
     */
    const handleStopMusic = () => {
        if (isPlaying) {
            setIsPlaying(false);
            soundPlaybackManager.stopPlayback();
            console.log("Stopping music");
        }
    }

    /**
     * Index of the selected melody in the list of melodies
     */
    const selectedMelodyIndex = melodiesStorage.getMelodiesList()?.findIndex(m => m.getId() === selectedMelody?.getId());

    return {
        handleEditClick,
        handleTextChange,
        handlePlayMusic,
        handleStopMusic,
        selectedMelodyIndex
    };
};
