import * as Tone from 'tone';
import {Chorus, Distortion, Filter, Reverb, Tremolo} from 'tone';
import {Instrument, InstrumentOptions} from 'tone/build/esm/instrument/Instrument';
import {convertLetterToNote} from './char_converter';
import {SynthType} from "./synth_types";
import {EffectNode, SynthData} from "./synth_data";
import {ChorusEffect, DistortionEffect, Effect, FilterEffect, ReverbEffect, TremoloEffect} from "./effect";
import {EffectType} from "./effect_types";

/**
 * A class managing all synths used and playback of notes.
 */
export class SoundPlaybackManager {
    private static readonly SYNTHS_VOLUME: number = 15;

    private synths: Map<SynthType, SynthData>;
    private selectedSynthType: SynthType;

    /**
     * Constructs a new {@link SoundPlaybackManager} instance.
     */
    public constructor() {
        this.synths = new Map();
        this.selectedSynthType = SynthType.SYNTH;
        this.buildSynths();
    }

    /**
     * Play a given text with the given time interval between each note.
     *
     * @param text - the text to play
     * @param noteDuration - the duration of each note in seconds
     */
    public playText(text: string, noteDuration: number) {
        this.stopPlayback();
        const selectedSynth = this.getSelectedSynth();
        if (selectedSynth) {
            let startTime = 0;
            let charactersPlayedCount = 0;
            // FIXME: sometimes the Start time must be strictly greater than previous start time
            //  error is thrown
            for (const character of text) {
                const noteToPlay = convertLetterToNote(character);
                if (noteToPlay != null) {
                    Tone.Transport.schedule((time) => {
                        selectedSynth.triggerAttackRelease(noteToPlay, noteDuration, time);
                    }, startTime);
                    startTime += noteDuration;
                    charactersPlayedCount += 1;
                }
            }

            if (charactersPlayedCount != 0) {
                this.startPlayback();
            }
        }
    }

    /**
     * Sets the selected synth by using its type.
     *
     * @param synthType - the selected synth type
     *
     * @see {@link SynthType}
     */
    public setSelectedSynth(synthType: SynthType) {
        this.selectedSynthType = synthType;
    }

    /**
     * Add or replace an {@link Effect} to the synth having the given {@link SynthType}.
     *
     * Effects will be recreated to perform changes, if the given synth type correspond
     * to an available synth.
     *
     * Method made with the help of EffectController class from JavaScript Software Synthesizer,
     * made by Michael Kolesidis.
     *
     * @param synthType the type of the synth to choose
     * @param effect    the effect to add or replace
     */
    public addOrReplaceSynthEffect(synthType: SynthType, effect: Effect) {
        const synthData = this.synths.get(synthType);
        if (synthData == null) {
            // No synth data corresponding to the synth type provided, do not do anything
            return;
        }

        const previousEffect = this.getEffectFromEffectsSet(synthData, effect.effectType);

        if (previousEffect != null) {
            const previousToneEffect = synthData.effects.get(previousEffect);
            if (previousToneEffect) {
                if (previousToneEffect instanceof Chorus || previousToneEffect instanceof Tremolo) {
                    // Some effects require to call stop()
                    previousToneEffect.stop();
                }
                previousToneEffect.disconnect();
                previousToneEffect.dispose();
                synthData.effects.delete(previousEffect);
            }
        }

        const newToneEffect = this.buildToneEffect(effect);
        if (newToneEffect instanceof Chorus || newToneEffect instanceof Tremolo) {
            // Some effects require to call start()
            newToneEffect.start();
        }

        newToneEffect.toDestination();
        synthData.synth.connect(newToneEffect);
        synthData.effects.set(effect, newToneEffect);
    }

    /**
     * Delete an {@link Effect} to the synth having the given {@link SynthType}.
     *
     * Effects will be recreated to perform changes, if the given synth type correspond
     * to an available synth and the given effect was used by the synth.
     *
     * Method made with the help of EffectController class from JavaScript Software Synthesizer,
     * made by Michael Kolesidis.
     *
     * @param synthType the type of the synth to choose
     * @param effect    the effect to add or replace
     */
    public deleteEffect(synthType: SynthType, effect: Effect) {
        const synthData = this.synths.get(synthType);
        if (synthData == null) {
            // No synth data corresponding to the synth type provided, do not do anything
            return;
        }
        const toneEffectToDelete = synthData.effects.get(effect);

        if (!toneEffectToDelete) {
            return;
        }

        if (toneEffectToDelete instanceof Chorus || toneEffectToDelete instanceof Tremolo) {
            // Some effects require to call stop()
            toneEffectToDelete.stop();
        }

        synthData.synth.disconnect();
        synthData.effects.forEach(effect => {
            synthData.synth.connect(effect);
        });

        synthData.effects.delete(effect);
    }

    /**
     * Build a new Tone.js effect from an {@link Effect}, based on the effect type.
     *
     * Properties in the `Effect` implementations will be used to construct their respective
     * Tone.js equivalent
     *
     * @param effect the effect data to use
     * @returns a new Tone.js effect using the properties of the provided effect data
     */
    private buildToneEffect(effect: Effect): EffectNode {
        switch (effect.effectType) {
            case EffectType.CHORUS: {
                const chorusEffect = effect as ChorusEffect;
                return new Chorus(
                    chorusEffect.frequency,
                    chorusEffect.delayTime,
                    chorusEffect.depth);
            }
            case EffectType.TREMOLO: {
                const tremoloEffect = effect as TremoloEffect;
                return new Tremolo(
                    tremoloEffect.frequency,
                    tremoloEffect.depth);
            }
            case EffectType.REVERB: {
                const reverbEffect = effect as ReverbEffect;
                return new Reverb(reverbEffect.decay);
            }
            case EffectType.FILTER: {
                const filterEffect = effect as FilterEffect;
                return new Filter(
                    filterEffect.frequency,
                    filterEffect.type,
                    filterEffect.rolloff);
            }
            case EffectType.DISTORTION: {
                const distortionEffect = effect as DistortionEffect;
                return new Distortion(distortionEffect.distortionValue);
            }
        }
    }

    /**
     * Get the first effect found equal to the given {@link EffectType} in the effects set from the
     * given {@link SynthData}.
     *
     * @param synthData  the synth data to use
     * @param effectType the type of the effect to find
     *
     * @returns the effect corresponding to the given effect type or `null` if no effect has been
     * found
     */
    private getEffectFromEffectsSet(synthData: SynthData, effectType: EffectType): Effect | null {
        for (const effect of synthData.effects.keys()) {
            if (effect.effectType == effectType) {
                return effect;
            }
        }
        return null;
    }

    /**
     * Returns an iterator of all synths types.
     *
     * @returns an iterator of all synths types
     */
    public getSynthsTypeList() : Iterable<SynthType> {
        return this.synths.keys();
    }

    /**
     * Build the list of synths which can be used.
     */
    private buildSynths() : void {
        this.synths.set(SynthType.SYNTH, {
            synth: new Tone.Synth({
                volume: SoundPlaybackManager.SYNTHS_VOLUME
            }).toDestination(),
            effects: new Map<Effect, EffectNode>(),
        });
        this.synths.set(SynthType.FM_SYNTH, {
            synth: new Tone.FMSynth({
                volume: SoundPlaybackManager.SYNTHS_VOLUME
            }).toDestination(),
            effects: new Map<Effect, EffectNode>()
        });
        this.synths.set(SynthType.PLUCK, {
            synth: new Tone.PluckSynth({
                volume: SoundPlaybackManager.SYNTHS_VOLUME
            }).toDestination(),
            effects: new Map<Effect, EffectNode>()
        });
    }

    /**
     * Start playback of the current sequence, if there is one.
     */
    private startPlayback() : void {
        Tone.Transport.start();
    }

    /**
     * Stop playback of the current sequence playing, if there is one.
     */
    public stopPlayback() : void {
        Tone.Transport.stop();
    }

    /**
     * Get the selected synth.
     *
     * @returns the selected synth
     */
    private getSelectedSynth() : Instrument<InstrumentOptions> | null {
        return this.synths.get(this.selectedSynthType)?.synth || null;
    }
}
