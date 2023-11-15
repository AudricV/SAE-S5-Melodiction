import Melody from "../../melody";
import MelodiesStorage from "../melodies_storage";

/**
 * A local implementation of {@link MelodiesStorage} using LocalStorage APIs.
 */
export default class LocalMelodiesStorage implements MelodiesStorage {

    // Default melody values

    /**
     * The default melody name, used as a fallback when an invalid name or no name has been found
     * for a melody.
     */
    static readonly DEFAULT_MELODY_NAME = "Melody";

    /**
     * The default melody text, used as a fallback when no text has been found for a melody.
     */
    static readonly DEFAULT_MELODY_TEXT = "";

    // Name of melody preferences keys

    /**
     * The name of the local storage preference key used to store melodies.
     */
    static readonly LOCAL_STORAGE_KEY_NAME = "melodies_list";

    /**
     * The name of melodies' identifier key.
     */
    static readonly MELODY_ID_KEY_NAME = "id";

    /**
     * The name of melodies' name key.
     */
    static readonly MELODY_NAME_KEY_NAME = "name";

    /**
     * The name of melodies' text key.
     */
    static readonly MELODY_TEXT_KEY_NAME = "melodyText";

    /**
     * The name of melodies' last modified timestamp key.
     */
    static readonly MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP = "lastModifiedTimestamp";

    private melodyList: Melody[] = [];

    constructor() {
        try {
            const serializedMelodiesList = localStorage.getItem(
                LocalMelodiesStorage.LOCAL_STORAGE_KEY_NAME);
            this.unserializeMelodiesList(serializedMelodiesList || "[]");
        } catch (e) {
            console.error("Unable to get melodies list", e);
        }
    }

    getMelodiesList(): ReadonlyArray<Melody> | null {
        return this.melodyList;
    }

    getMelodiesCount(): number | null {
        return this.melodyList.length;
    }

    addMelody(melody: Melody): boolean {
        this.melodyList.push(melody);
        return this.saveMelodyList();
    }

    updateMelody(melodyIndex: number, newMelodyData: Melody): boolean {
        // Don't do anything if the melody index is out of the melody list bounds
        if (this.isMelodyIndexOutOfBounds(melodyIndex)) {
            return false;
        }

        this.melodyList[melodyIndex] = newMelodyData;
        return this.saveMelodyList();
    }

    deleteMelody(melodyIndex: number): boolean {
        // Don't do anything if the melody index is out of the melody list bounds
        if (this.isMelodyIndexOutOfBounds(melodyIndex)) {
            return false;
        }
        this.melodyList.splice(melodyIndex, 1);
        return this.saveMelodyList();
    }

    deleteAllMelodies(): boolean {
        this.melodyList.splice(0, this.melodyList.length);
        return this.saveMelodyList();
    }

    moveMelody(oldMelodyIndex: number, newMelodyIndex: number): boolean {
        // Don't do anything if the melody indexes are out of the melody list bounds
        if (this.isMelodyIndexOutOfBounds(oldMelodyIndex)
            || this.isMelodyIndexOutOfBounds(newMelodyIndex)) {
            return false;
        }

        // No need to move the melody at the new index if the new index is equal to the old one
        if (oldMelodyIndex === newMelodyIndex) {
            return true;
        }

        this.melodyList.splice(newMelodyIndex, 0, this.melodyList.splice(oldMelodyIndex, 1)[0]);
        return this.saveMelodyList();
    }

    /**
     * Unserialize melodies list from local storage string list.
     *
     * @param serializedMelodiesList the melodies list, serialized in local storage
     */
    private unserializeMelodiesList(serializedMelodiesList: string): void {
        // Clear any unsaved melody, in order to not return an incorrect melodies list
        this.melodyList.splice(0, this.melodyList.length);
        const parsedMelodies = JSON.parse(serializedMelodiesList);

        parsedMelodies.forEach((jsonMelody: any) => {
            const melodyId: string = jsonMelody[LocalMelodiesStorage.MELODY_ID_KEY_NAME];
            if (!melodyId || melodyId.length == 0) {
                console.warn("No melody ID or invalid melody ID. Ignoring this saved melody.");
                return;
            }

            let melodyName: string = jsonMelody[LocalMelodiesStorage.MELODY_NAME_KEY_NAME];
            if (!melodyName || melodyName.length == 0) {
                console.warn("Invalid melody name: \"" + melodyName
                    + "\". Using a default name instead.");
                melodyName = LocalMelodiesStorage.DEFAULT_MELODY_NAME;
            }

            let melodyText: string = jsonMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_NAME];
            if (!melodyText) {
                console.warn("No melody text, using an empty one.");
                melodyText = LocalMelodiesStorage.DEFAULT_MELODY_TEXT;
            }

            const melodyLastModifiedTimestampText: string =
                jsonMelody[LocalMelodiesStorage.MELODY_TEXT_KEY_LAST_MODIFIED_TIMESTAMP];
            let melodyLastModifiedTimestamp = Number.parseInt(melodyLastModifiedTimestampText, 10);
            if (Number.isNaN(melodyLastModifiedTimestamp) || melodyLastModifiedTimestamp < 0) {
                // This shouldn't happen if the storage isn't corrputed or the user or an extension
                // didn't change the preference
                console.warn("Invalid melody last modified timestamp: \""
                    + melodyLastModifiedTimestamp + "\". Using current time instead.");
                melodyLastModifiedTimestamp = Date.now();
            }

            this.melodyList.push(
                new Melody(melodyId, melodyName, melodyText, melodyLastModifiedTimestamp));
        });
    }

    /**
     * Save the current in-memory melody list to client's local storage.
     *
     * @remarks
     *
     * The list is saved a JSON object stringified.
     *
     * If an error when saving the list happens, the error is printed to client's console.
     *
     * @returns whether the melody list has been successfully saved
     */
    private saveMelodyList(): boolean {
        try {
            localStorage.setItem(LocalMelodiesStorage.LOCAL_STORAGE_KEY_NAME,
                JSON.stringify(this.melodyList));
            return true;
        } catch (e) {
            console.error("Unable to save melody list", e);
            return false;
        }
    }

    /**
     * Checks if a given melody index is out of bounds.
     *
     * @remarks
     *
     * A melody index is out of bounds if the index is < 0 and > melody list length.
     *
     * @param melodyIndex the melody index to check
     * @returns whether the melody index is out of bounds
     */
    private isMelodyIndexOutOfBounds(melodyIndex: number): boolean {
        return melodyIndex < 0 || melodyIndex > this.melodyList.length - 1;
    }
}
