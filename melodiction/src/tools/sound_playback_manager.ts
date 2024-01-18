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
    private synths: Map<SynthType, SynthData>;
    private selectedSynthType: SynthType;
    private currentSequence: Tone.Sequence | null = null;

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
        const selectedSynth = this.getSelectedSynth();
        if (selectedSynth) {
            this.stopPlayback();

            let startTime = 0;
            const events = [];
            for (const character of text) {
                const noteToPlay = convertLetterToNote(character);
                if (noteToPlay != null) {
                    events.push({
                        note: noteToPlay,
                        beginTime: startTime
                    });
                    startTime += noteDuration;
                }
            }

            if (events.length === 0) {
                return;
            }

            this.currentSequence = new Tone.Sequence({
                loop: false,
                callback: (_time, note) => {
                    selectedSynth.triggerAttackRelease(note.note, noteDuration, Tone.now() + note.beginTime);
                },
                events: events
            });

            this.startPlayback();
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

        synthData.synth.disconnect();

        const previousEffect = this.getEffectFromEffectsSet(synthData, effect.effectType);

        if (previousEffect != null) {
            const previousToneEffect = synthData.effects.get(previousEffect);
            if (previousToneEffect) {
                if (previousToneEffect instanceof Chorus || previousToneEffect instanceof Tremolo) {
                    // Some effects require to call stop()
                    previousToneEffect.stop();
                }
                previousToneEffect.disconnect();
            }
            synthData.effects.delete(previousEffect);
        }

        const newToneEffect = this.buildToneEffect(effect);
        if (newToneEffect instanceof Chorus || newToneEffect instanceof Tremolo) {
            // Some effects require to call start()
            newToneEffect.start();
        }

        synthData.effects.set(effect, newToneEffect);
        synthData.effects.forEach(value => {
            synthData.synth.connect(value);
        });
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

        synthData.synth.disconnect();
        if (toneEffectToDelete instanceof Chorus || toneEffectToDelete instanceof Tremolo) {
            // Some effects require to call stop()
            toneEffectToDelete.stop();
        }
        toneEffectToDelete.disconnect();
        synthData.effects.delete(effect);

        synthData.effects.forEach(value => {
            synthData.synth.connect(value);
        });
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
                    chorusEffect.depth).toDestination();
            }
            case EffectType.TREMOLO: {
                const tremoloEffect = effect as TremoloEffect;
                return new Tremolo(
                    tremoloEffect.frequency,
                    tremoloEffect.depth).toDestination();
            }
            case EffectType.REVERB: {
                const reverbEffect = effect as ReverbEffect;
                return new Reverb(reverbEffect.decay).toDestination();
            }
            case EffectType.FILTER: {
                const filterEffect = effect as FilterEffect;
                return new Filter(
                    filterEffect.frequency,
                    filterEffect.type,
                    filterEffect.rolloff).toDestination();
            }
            case EffectType.DISTORTION: {
                const distortionEffect = effect as DistortionEffect;
                return new Distortion(distortionEffect.distortionValue).toDestination();
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
            synth: new Tone.Synth().toDestination(),
            effects: new Map<Effect, EffectNode>()
        });
        this.synths.set(SynthType.FM_SYNTH, {
            synth: new Tone.FMSynth().toDestination(),
            effects: new Map<Effect, EffectNode>()
        });
        this.synths.set(SynthType.PLUCK, {
            synth: new Tone.PluckSynth().toDestination(),
            effects: new Map<Effect, EffectNode>()
        });
    }

    /**
     * Start playback of the current sequence, if there is one.
     */
    private startPlayback() : void {
        if (this.currentSequence != null) {
            this.currentSequence.start();
        }
        Tone.Transport.start();
    }

    /**
     * Stop playback of the current sequence playing, if there is one.
     */
    public stopPlayback() : void {
        // TODO: stop doesn't work properly
        if (this.currentSequence != null) {
            this.currentSequence.stop();
            this.currentSequence.clear();
        }
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
