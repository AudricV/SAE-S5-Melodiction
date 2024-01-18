import { create } from 'zustand';
import { ChorusEffect, TremoloEffect, ReverbEffect, FilterEffect, DistortionEffect } from '../tools/effect';
import { EffectType } from '../tools/effect_types';
import { SynthType } from '../tools/synth_types';

interface AudioEffectsStore {
    chorusEffect: ChorusEffect;
    tremoloEffect: TremoloEffect;
    reverbEffect: ReverbEffect;
    filterEffect: FilterEffect;
    distortionEffect: DistortionEffect;
    synthType: SynthType;
    setChorusEffect: (effect: ChorusEffect) => void;
    setTremoloEffect: (effect: TremoloEffect) => void;
    setReverbEffect: (effect: ReverbEffect) => void;
    setFilterEffect: (effect: FilterEffect) => void;
    setDistortionEffect: (effect: DistortionEffect) => void;
    setSynthType: (synthType: SynthType) => void;
}

export const useAudioStore = create<AudioEffectsStore>((set) => ({
    chorusEffect: {
        effectType: EffectType.CHORUS,
        frequency: 1.5,
        delayTime: 0.5,
        depth: 0.8,
    },
    tremoloEffect: {
        effectType: EffectType.TREMOLO,
        frequency: 5,
        depth: 0.6,
    },
    reverbEffect: {
        effectType: EffectType.REVERB,
        wet: 0.7,
        decay: 0.1,
    },
    filterEffect: {
        effectType: EffectType.FILTER,
        frequency: 100,
        type: 'lowpass',
        rolloff: -12,
    },
    distortionEffect: {
        effectType: EffectType.DISTORTION,
        distortionValue: 0.5,
    },
    synthType: SynthType.SYNTH,
    setChorusEffect: (effect) => set(() => ({ chorusEffect: effect })),
    setTremoloEffect: (effect) => set(() => ({ tremoloEffect: effect })),
    setReverbEffect: (effect) => set(() => ({ reverbEffect: effect })),
    setFilterEffect: (effect) => set(() => ({ filterEffect: effect })),
    setDistortionEffect: (effect) => set(() => ({ distortionEffect: effect })),
    setSynthType: (synthType) => set(() => ({ synthType: synthType })),
}));