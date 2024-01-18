import {Instrument, InstrumentOptions} from "tone/build/esm/instrument/Instrument";
import {Effect} from "./effect.ts";
import {FeedbackEffectOptions} from "tone/build/esm/effect/FeedbackEffect";
import {StereoFeedbackEffect} from "tone/build/esm/effect/StereoFeedbackEffect";
import {Effect as ToneEffect, EffectOptions} from "tone/build/esm/effect/Effect";
import {StereoEffect, StereoEffectOptions} from "tone/build/esm/effect/StereoEffect";
import {Filter} from "tone";

export type EffectNode = | ToneEffect<EffectOptions>
    | StereoEffect<StereoEffectOptions>
    | StereoFeedbackEffect<FeedbackEffectOptions>
    | Filter;

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
    effects: Map<Effect, EffectNode>
}
