import Melody from "../../melody";
import MelodiesStorage from "../melodies_storage";
import MapifyTs from "mapify-ts";
import {SynthType} from "../../../tools/synth_types";
import {
    ChorusEffect,
    DistortionEffect,
    Effect,
    FilterEffect,
    ReverbEffect,
    TremoloEffect
} from "../../../tools/effect";

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

    /**
     * The name of melodies' effect key.
     */
    static readonly MELODY_EFFECTS_KEY_NAME = "effects";

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
                // This shouldn't happen if the storage isn't corrupted or the user or an extension
                // didn't change the preference
                console.warn("Invalid melody last modified timestamp: \""
                    + melodyLastModifiedTimestamp + "\". Using current time instead.");
                melodyLastModifiedTimestamp = Date.now();
            }

            const melodyEffectsText: string = jsonMelody[LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME];
            const melodyEffects: Map<SynthType, Effect[]> = new Map<SynthType, Effect[]>();

            const unserializedMelodySynthAndEffects = MapifyTs.deserialize(melodyEffectsText);
            // If the effects key is defined, parse its effects linked to their synth types
            if (unserializedMelodySynthAndEffects) {
                for (const parsedMelodyEffect of Object.entries(unserializedMelodySynthAndEffects)) {
                    const synthAndEffect = this.parseMelodySynthAndEffect(parsedMelodyEffect);
                    if (synthAndEffect != null) {
                        melodyEffects.set(synthAndEffect.synthType, synthAndEffect.effects);
                    }
                }
            }

            this.melodyList.push(
                new Melody(
                    melodyId,
                    melodyName,
                    melodyText,
                    melodyLastModifiedTimestamp,
                    melodyEffects));
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
                JSON.stringify(this.melodyList, (key, value) => {
                    if (key == LocalMelodiesStorage.MELODY_EFFECTS_KEY_NAME
                        && value instanceof Map) {
                        return MapifyTs.serialize(value);
                    }
                    return value;
                }));
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
     *
     * @returns whether the melody index is out of bounds
     */
    private isMelodyIndexOutOfBounds(melodyIndex: number): boolean {
        return melodyIndex < 0 || melodyIndex > this.melodyList.length - 1;
    }

    private parseMelodySynthAndEffect(melodySynthAndEffectToParse: any): {
        effects: Effect[];
        synthType: SynthType
    } | null {
        const synthType = this.parseMelodySynthType(melodySynthAndEffectToParse);
        if (synthType == null) {
            console.log("Invalid synth type, ignoring this synth type and effect");
            return null;
        }
        const effectsProperty = melodySynthAndEffectToParse[synthType];
        const effects: Effect[] = [];
        if (effectsProperty instanceof Array) {
            for (const effectToParse of effectsProperty) {
                const effect = this.parseMelodyEffect(effectToParse);
                if (effect == null) {
                    continue;
                }
                effects.push(effect);
            }
        }
        return {
            synthType,
            effects: effects
        };
    }

    /**
     * Parse a synth type from its unserialized melody synth type and effect map entry
     * representation.
     *
     * @param melodySynthAndEffectToParse - the melody synth type and effect to parse
     *
     * @returns an {@link SynthType} corresponding the representation or `null` if no synth type
     * could be parsed
     */
    private parseMelodySynthType(melodySynthAndEffectToParse: any): SynthType | null {
        if (Object.prototype.hasOwnProperty.call(melodySynthAndEffectToParse, 0)) {
            return SynthType.SYNTH;
        }
        if (Object.prototype.hasOwnProperty.call(melodySynthAndEffectToParse, 1)) {
            return SynthType.FM_SYNTH;
        }
        if (Object.prototype.hasOwnProperty.call(melodySynthAndEffectToParse, 2)) {
            return SynthType.PLUCK;
        }
        return null;
    }

    /**
     * Parse an effect from its unserialized melody synth and effect map entry representation.
     *
     * @param melodySynthAndEffectToParse - the melody synth type and effect to parse
     * @returns an {@link Effect} corresponding the representation or `null` if no effect could be
     * parsed
     */
    private parseMelodyEffect(melodySynthAndEffectToParse: any): Effect | null {
        if (!melodySynthAndEffectToParse) {
            console.warn("Invalid melody effect, ignoring this saved effect");
            return null;
        }

        if (typeof (melodySynthAndEffectToParse.frequency) == "number") {
            if (typeof (melodySynthAndEffectToParse.depth) == "number") {
                if (typeof (melodySynthAndEffectToParse.delayTime) == "number") {
                    return {
                        frequency: melodySynthAndEffectToParse.frequency,
                        delayTime: melodySynthAndEffectToParse.delayTime,
                        depth: melodySynthAndEffectToParse.depth,
                    } as ChorusEffect;
                }
                return {
                    frequency: melodySynthAndEffectToParse.frequency,
                    delayTime: melodySynthAndEffectToParse.delayTime,
                } as unknown as TremoloEffect;
            }

            if (typeof (melodySynthAndEffectToParse.type) == "string"
                && typeof (melodySynthAndEffectToParse.rolloff) == "number") {
                return {
                    frequency: melodySynthAndEffectToParse.frequency,
                    type: melodySynthAndEffectToParse.type,
                    rolloff: melodySynthAndEffectToParse.rolloff
                } as FilterEffect;
            }
        }

        if (typeof (melodySynthAndEffectToParse.decay) == "number") {
            return {
                decay: melodySynthAndEffectToParse.decay
            } as ReverbEffect;
        }

        if (typeof (melodySynthAndEffectToParse.distortionValue) == "number") {
            return {
                distortionValue: melodySynthAndEffectToParse.distortionValue
            } as DistortionEffect;
        }

        console.warn("Invalid melody effect, ignoring this saved effect");
        return null;
    }
}
