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
            // TODO: better error handling
            console.error("Unable to add the new melody");
        }
    };

    const handleMelodyNameChanged = (melodyIndex: number, melody: Melody) => {
        if (melodiesStorage.updateMelody(melodyIndex, melody)) {
            setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
        } else {
            console.log("Error when renaming a melody") // Beter error handling
        }
        return true;
    }

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
        handleMelodyDeleted,
        handleMelodySaved
    };
};
