import * as Tone from 'tone';
import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument';
import { convertLetterToNote } from './char_converter';

/**
 * Types of synths.
 */
export enum SynthType {
    SYNTH
    // TODO: add other synth types when we will use them
}

/**
 * A class managing all synths used and playback of notes.
 */
export class SoundPlaybackManager {
    private synths: Map<SynthType, Instrument<InstrumentOptions>>;
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
     * Returns an iterator of all synths types.
     *
     * @returns an iterator of all synths types
     */
    public getSynthsTypeList() : Iterable<SynthType> {
        return this.synths.keys();
    }

    setSynthOptions(synthType: SynthType, synthOptions: InstrumentOptions) {
        const synth = this.synths.get(synthType);
        if (synth) {
            // TODO: passing directly options seems to require building a new object,
            // check what we really need to do to apply new options
        }
    }

    /**
     * Build the list of synths which can be used.
     */
    private buildSynths() : void {
        const synth = new Tone.Synth().toDestination();
        this.synths.set(SynthType.SYNTH, synth);
        // TODO: add other synths when we will use them
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
        Tone.Transport.cancel()
        if (this.currentSequence != null) {
            this.currentSequence.stop();
        }
        Tone.Transport.stop();
    }

    /**
     * Get the selected synth.
     *
     * @returns the selected synth
     */
    private getSelectedSynth() : Instrument<InstrumentOptions> | null {
        return this.synths.get(this.selectedSynthType) || null;
    }
}
