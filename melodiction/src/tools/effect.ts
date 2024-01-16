import {FilterRollOff} from "tone";
import {EffectType} from "./effect_types";

/**
 * Base effect interface.
 */
export interface Effect {
    /**
     * The type of the effect.
     *
     * It should be used to compare the type of different effects.
     */
    effectType: EffectType
}

/**
 * Interface representing the properties used for the chorus effect.
 */
export interface ChorusEffect extends Effect {
    /**
     * The frequency of the low frequency oscillator.
     */
    frequency: number,

    /**
     * The delay of the chorus effect in ms.
     */
    delayTime: number,

    /**
     * The depth of the chorus.
     */
    depth: number,

    effectType: EffectType.CHORUS
}

/**
 * Interface representing the properties used for the tremolo effect.
 */
export interface TremoloEffect extends Effect {
    /**
     * The rate of the effect.
     */
    frequency: number,

    /**
     * The depth of the effect.
     */
    depth: number,

    effectType: EffectType.TREMOLO
}

/**
 * Interface representing the properties used for the reverb effect.
 */
export interface ReverbEffect extends Effect {
    /**
     * The percentage of the mix between the effect and the signal.
     */
    wet: number,

    effectType: EffectType.REVERB
}

/**
 * Interface representing the properties used for the filter effect.
 */
export interface FilterEffect extends Effect {
    /**
     * The cutoff frequency of the filter.
     */
    frequency: number,

    /**
     * The type of the filter.
     *
     * Possible values are `"lowpass"`, `"highpass"`, `"bandpass"`, `"lowshelf"`, `"highshelf"`,
     * `"notch"`, `"allpass"` and `"peaking"`.
     *
     * @see {@link BiquadFilterType}
     */
    type: BiquadFilterType,

    /**
     * The drop in decibel per octave.
     *
     * Possible values are the ones of {@link FilterRollOff the `FilterRollOff` type}.
     */
    rolloff: FilterRollOff,

    effectType: EffectType.FILTER
}

/**
 * Interface representing the properties used for the distortion effect.
 */
export interface DistortionEffect extends Effect {
    /**
     * The distortion value, a number which must be between 0 and 1.
     */
    distortionValue: number,

    effectType: EffectType.DISTORTION
}
