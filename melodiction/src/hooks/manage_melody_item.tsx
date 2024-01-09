import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Melody from "../data/melody";
import { useMelodyStore } from "../store/melodyStore";
import { v4 as uuidv4 } from 'uuid';
import MelodiesStorage from "../data/storage/melodies_storage.ts";

export const useManageMelody = (melodiesStorage: MelodiesStorage) => {
    const { selectedMelody, setSelectedMelody } = useMelodyStore();
    const navigate = useNavigate();

    const melodiesList: ReadonlyArray<Melody> = melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>);

    const [melodyCount, setMelodyCount] = useState(melodiesStorage.getMelodiesCount() ?? 0);
    const [melodies, setMelodies] = useState(melodiesList);

    // TODO: when the list is updated, melodiesStorage.getMelodiesList() is called. Is it really needed to get the list
    //  again? Couldn't we update the list ourselves?
    //  However, this has an advantage: if multiple clients edit their melodies list on the same storage with the same
    //  account if the storage requires an account, they will get the latest version if the storage implementation do
    //  no cache results

    /**
     * Handle a melody add event.
     *
     * @param text the text of the melody
     * @returns true if a new melody has been added, false otherwise
     */
    const handleAddNewMelody = (text: string) => {
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
            // TODO: Better error handling?
            console.error("Unable to add the new melody");
        }
    };

    /**
     * Handle a melody rename event.
     *
     * @param melodyIndex - the index of the melody in the list of melodies
     * @param melody the melody to rename
     * @returns true if the melody has been renamed, false otherwise
     */
    const handleMelodyNameChanged = (melodyIndex: number, melody: Melody) => {
        if (melodiesStorage.updateMelody(melodyIndex, melody)) {
            setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
        } else {
            // TODO: Better error handling
            console.error("Error when renaming a melody");
            return false;
        }
        return true;
    }

    /**
     * Handle a melody click event.
     *
     * This handler will select the melody corresponding to the melody index
     * and navigate to the melody page.
     *
     * @param melodyIndex - the index of the melody in the list of melodies
     */
    const handleMelodyClicked = (melodyIndex: number) => {
        if (melodies[melodyIndex]) {
            setSelectedMelody(melodies[melodyIndex] || null);
            navigate(`/melody/${melodies[melodyIndex].getId()}`);
        } else {
            // TODO: Better error handling?
            console.error("Error when selecting a melody");
        }
    }

    /**
     * Handle a melody delete event.
     *
     * @param melodyIndex - the index of the melody in the list of melodies
     * @returns true if the melody has been deleted, false otherwise
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
            // TODO: Better error handling?
            console.error("Error when deleting a melody");
            return false;
        }
    }

    /**
     * Handle a melody saved callback.
     *
     * @param melodyIndex - the index of the melody in the list of melodies
     * @param melody - the melody to save
     * @returns true if the melody has been saved, false otherwise
     */
    const handleMelodySaved = (melodyIndex: number, melody: Melody) => {
        if (melodiesStorage.updateMelody(melodyIndex, melody)) {
            setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
        } else {
            // TODO: better error handling?
            console.log("Error when saving a melody");
            return false;
        }
        return true;
    }

    return {
        melodies,
        melodyCount,
        melodiesStorage,
        handleAddNewMelody,
        handleMelodyNameChanged,
        handleMelodyClicked,
        handleMelodyDeleted,
        handleMelodySaved
    };
};
