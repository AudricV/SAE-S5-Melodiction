import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Melody from "../data/melody";
import LocalMelodiesStorage from "../data/storage/impl/local_melodies_storage";
import { useMelodyStore } from "../store/melodyStore";
import { v4 as uuidv4 } from 'uuid';

export const useManageMelody = () => {
    const { selectedMelody, setSelectedMelody } = useMelodyStore();
    const navigate = useNavigate();

    const melodiesStorage = new LocalMelodiesStorage();
    const melodiesList: ReadonlyArray<Melody> = melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>);

    const [melodyCount, setMelodyCount] = useState(melodiesStorage.getMelodiesCount() ?? 0);
    const [melodies, setMelodies] = useState(melodiesList);

    /**
     * 
     * @param text The text of the melody
     * @returns true if the melody has been added, false otherwise
     * @description Add a new melody to the list of melodies
     * @todo Better error handling
     */
    const addNewMelody = (text: string) => {
        const newMelody = new Melody(
            uuidv4(),
            'Mélodie',
            text,
            Date.now()
        );

        if (melodiesStorage.addMelody(newMelody)) {
            setMelodyCount(prevCount => prevCount + 1);
            setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
            setSelectedMelody(newMelody);
            navigate(`/melody/${newMelody.getId()}`);
        } else {
            console.error("Unable to add the new melody");
        }
    };

    /**
     * 
     * @param melodyIndex - the index of the melody in the list of melodies
     * @param melody The melody to rename
     * @returns true if the melody has been renamed, false otherwise
     * @description Rename a melody
     * @todo Better error handling
     */
    const handleMelodyNameChanged = (melodyIndex: number, melody: Melody) => {
        if (melodiesStorage.updateMelody(melodyIndex, melody)) {
            setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
        } else {
            console.log("Error when renaming a melody") // Beter error handling
        }
        return true;
    }

    /**
     * 
     * @param melodyIndex - the index of the melody in the list of melodies
     * @description Select a melody and navigate to the melody page
     */
    const handleMelodyClicked = (melodyIndex: number) => {
        if (melodiesStorage.getMelodiesList()?.[melodyIndex]) {
            setSelectedMelody(melodiesStorage.getMelodiesList()?.[melodyIndex] || null);
            navigate(`/melody/${melodiesStorage.getMelodiesList()?.[melodyIndex].getId()}`);
        } else {
            console.log("Error when selecting a melody") // Beter error handling
        }
    }

    /**
     * 
     * @param melodyIndex - the index of the melody in the list of melodies
     * @returns true if the melody has been deleted, false otherwise
     * @description Delete a melody
     * @todo Better error handling
     */
    const handleMelodyDeleted = (melodyIndex: number): boolean => {
        const melodyId = melodiesStorage.getMelodiesList()?.[melodyIndex].getId();
        if (melodiesStorage.deleteMelody(melodyIndex)) {
            setMelodyCount(prevCount => prevCount - 1);
            setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
            if (selectedMelody?.getId() === melodyId) {
                setSelectedMelody(null);
                navigate('/');
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * @param melodyIndex - the index of the melody in the list of melodies
     * @param melody - the melody to save
     * @returns true if the melody has been saved, false otherwise
     */
    const handleMelodySaved = (melodyIndex: number, melody: Melody) => {
        if (melodiesStorage.updateMelody(melodyIndex, melody)) {
            setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
        } else {
            console.log("Error when saving a melody") // Beter error handling
            return false;
        }
        return true;
    }

    return {
        melodies,
        melodyCount,
        melodiesStorage,
        addNewMelody,
        handleMelodyNameChanged,
        handleMelodyClicked,
        handleMelodyDeleted,
        handleMelodySaved
    };
};
