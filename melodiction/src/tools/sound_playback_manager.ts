import * as Tone from 'tone';
import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument';

/**
 * A class managing all synths used and playback of notes.
 */
class SoundPlaybackManager {
    private synths: Map<SynthType, Instrument<InstrumentOptions>>;
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
     * Play a given note in the given time.
     *
     * @param note - the name of the note
     * @param noteDuration - the duration of the note
     */
    public playNote(note: string, noteDuration: number) {
        const now = Tone.now();
        const selectedSynth = this.getSelectedSynth();
        if (selectedSynth) {
            selectedSynth.triggerAttack(note, now);
            selectedSynth.triggerRelease(now + noteDuration);
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
    private buildSynths() {
        const synth = new Tone.Synth().toDestination();
        this.synths.set(SynthType.SYNTH, synth);
        // TODO: add other synths
    }

    private getSelectedSynth() : Instrument<InstrumentOptions> | undefined {
        return this.synths.get(this.selectedSynthType);
    }
}

/**
 * Types of synths.
 */
export enum SynthType {
    SYNTH
    // TODO: add other synth types
}

export default SoundPlaybackManager;
