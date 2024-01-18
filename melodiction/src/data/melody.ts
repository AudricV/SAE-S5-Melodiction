import {SynthType} from "../tools/synth_types.ts";
import {Effect} from "../tools/effect.ts";

/**
 * Data class representing a melody.
 *
 * @remarks
 *
 * A melody is composed of an id, a name, a melody text and the Unix timestamp of the latest
 * change.
 */
export default class Melody {

    private id: string;
    private name: string;
    private melodyText: string;
    private lastModifiedTimestamp: number;
    private effects: Map<SynthType, Effect[]>;

    /**
     * Constructs a new {@link Melody} instance.
     *
     * @param id - the identifier of the melody
     * @param name - the name of the melody
     * @param melodyText - the text of the melody
     * @param lastModifiedTimestamp - the Unix timestamp of the latest change, which must be >= 0
     * @param effects - the map of effects with their saved effects, effects are saved by their
     * synth type
     *
     * @throws {@link InvalidTimestampError}
     * if the timestamp provided is < 0
     */
    constructor(id: string,
                name: string,
                melodyText: string,
                lastModifiedTimestamp: number,
                effects: Map<SynthType, Effect[]>) {
        this.id = id;
        this.name = name;
        this.melodyText = melodyText;
        if (lastModifiedTimestamp < 0) {
            throw new InvalidTimestampError(lastModifiedTimestamp);
        }
        this.lastModifiedTimestamp = lastModifiedTimestamp;
        this.effects = effects;
    }

    /**
     * Returns the identifier of the melody.
     *
     * @returns the identifier of the melody
     */
    getId(): string {
        return this.id;
    }

    /**
     * Returns the name of the melody.
     *
     * @returns the name of the melody
     */
    getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the melody.
     *
     * @param name - the new name of the melody.
     */
    setName(name: string): void {
        this.name = name;
    }

    /**
     * Returns the text of the melody.
     *
     * @returns the text of the melody
     */
    getMelodyText(): string {
        return this.melodyText;
    }

    /**
     * Sets the text of the melody.
     *
     * @param melodyText - the new text of the melody
     */
    setMelodyText(melodyText: string): void {
        this.melodyText = melodyText;
    }

    /**
     * Returns the Unix timestamp of the latest change.
     *
     * @returns the Unix timestamp of the latest change
     */
    getLastModifiedTimestamp(): number {
        return this.lastModifiedTimestamp;
    }

    /**
     * Sets the Unix timestamp of the latest change.
     *
     * @param lastModifiedTimestamp - the new Unix timestamp of the latest change, which must be >=
     * 0
     *
     * @throws {@link InvalidTimestampError}
     * if the timestamp provided is < 0
     */
    setLastModifiedTimestamp(lastModifiedTimestamp: number): void {
        if (lastModifiedTimestamp < 0) {
            throw new InvalidTimestampError(lastModifiedTimestamp);
        }
        this.lastModifiedTimestamp = lastModifiedTimestamp;
    }

    /**
     * Returns the effects per synth of the melody.
     *
     * @returns the effects per synth of the melody
     */
    getEffects(): Map<SynthType, readonly Effect[]> {
        return this.effects;
    }
}

/**
 * Error raised when an invalid timestamp is provided.
 */
export class InvalidTimestampError extends Error {
    constructor(invalidTimestamp: number) {
        super("Invalid timestamp: " + invalidTimestamp.toString());
    }
}
