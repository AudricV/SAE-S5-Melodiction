import Melody from "../melody";

/**
 * An interface representing the management of saved melodies.
 */
export default interface MelodiesStorage {

    /**
     * Get the list of saved melodies.
     *
     * @returns the list of saved melodies, unmodifiable, which could be empty, or `null` if the
     * melodies list couldn't be get
     */
    getMelodiesList(): ReadonlyArray<Melody> | null;

    /**
     * Get the saved melodies count.
     *
     * @returns the number of saved melodies, which must be >= 0, or `null` if the melodies count
     * couldn't be get
     */
    getMelodiesCount(): number | null;

    /**
     * Add a melody at the end of the list of saved melodies.
     *
     * @param melody - the melody to add
     * @returns whether the melody has been added and this change saved
     */
    addMelody(melody: Melody): boolean;

    /**
     * Update a melody by using its current index and the new melody data.
     *
     * @remarks
     *
     * If the index is out of the melody list bounds, this method shouldn't do anything and return
     * `false`.
     *
     * @param melodyIndex - the index of the melody to update
     * @param newMelodyData - the new melody data
     * @returns whether the melody has been successfully updated and this change saved
     */
    updateMelody(melodyIndex: number, newMelodyData: Melody): boolean;

    /**
     * Delete a melody by using its index.
     *
     * @remarks
     *
     * If the index is out of the melody list bounds, this method shouldn't do anything and return
     * `false`.
     *
     * @param melodyIndex - the index of the melody to delete
     * @returns whether the melody has been successfully deleted and this change saved
     */
    deleteMelody(melodyIndex: number): boolean;

    /**
     * Delete all melodies.
     *
     * @returns whether all melodies have been successfully deleted and this change saved
     */
    deleteAllMelodies(): boolean;

    /**
     * Move a melody by using its current index and the new requested one.
     *
     * @remarks
     *
     * If any of the indexes is out of the melody list bounds, this method shouldn't do anything
     * and return `false`.
     * 
     * @param oldMelodyIndex - the index of the melody to move
     * @param newMelodyIndex - the new index of the melody to move
     * @returns whether the melody has been successfully deleted and this change saved
     */
    moveMelody(oldMelodyIndex: number, newMelodyIndex: number): boolean;
}
