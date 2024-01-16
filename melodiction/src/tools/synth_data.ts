import {Instrument, InstrumentOptions} from "tone/build/esm/instrument/Instrument";
import {Effect} from "./effect.ts";

/**
 * Type to represent a synth and its applied effects.
 */
export type SynthData = {
    /**
     * The synth.
     */
    synth: Instrument<InstrumentOptions>,

    /**
     * The effects applied on the synth.
     */
    effects: Set<Effect>
}
