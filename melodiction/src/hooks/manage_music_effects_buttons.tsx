import { FilterRollOff } from "tone";
import { useAudioStore } from "../store/effectsStore";
import { SynthType } from "../tools/synth_types";

export const useManageMusicEffectsButtons = () => {

    const {
        chorusEffect,
        setChorusEffect,
        tremoloEffect,
        setTremoloEffect,
        reverbEffect,
        setReverbEffect,
        filterEffect,
        setFilterEffect,
        distortionEffect,
        setDistortionEffect,
        synthType,
        setSynthType,
    } = useAudioStore();

    const handheSynthChange = (synth: SynthType) => {
        setSynthType(synth);
    }

    const handleChorusFrequencyChange = (e: Event, value: number | number[]) => {
        setChorusEffect({ ...chorusEffect, frequency: value as number });
    }

    const handleChorusDelayTimeChange = (e: Event, value: number | number[]) => {
        setChorusEffect({ ...chorusEffect, delayTime: value as number });
    }

    const handleChorusDepthChange = (e: Event, value: number | number[]) => {
        setChorusEffect({ ...chorusEffect, depth: value as number });
    }

    const handleTremoloFrequencyChange = (e: Event, value: number | number[]) => {
        setTremoloEffect({ ...tremoloEffect, frequency: value as number });
    }

    const handleTremoloDepthChange = (e: Event, value: number | number[]) => {
        setTremoloEffect({ ...tremoloEffect, depth: value as number });
    }

    const handleReverbDecayChange = (e: Event, value: number | number[]) => {
        setReverbEffect({ ...reverbEffect, decay: value as number });
    }

    const handleFilterFrequencyChange = (e: Event, value: number | number[]) => {
        setFilterEffect({ ...filterEffect, frequency: value as number });
    }

    const handleFilterRolloffChange = (e: Event, value: number | number[]) => {
        setFilterEffect({ ...filterEffect, rolloff: value as FilterRollOff });
    }

    const handleDistortionValueChange = (e: Event, value: number | number[]) => {
        setDistortionEffect({ ...distortionEffect, distortionValue: value as number });
    }

    const handleResetEffects = () => {
        setChorusEffect({
            effectType: 0,
            frequency: 1.5,
            delayTime: 0.5,
            depth: 0.8,
        });
        setTremoloEffect({
            effectType: 1,
            frequency: 5,
            depth: 0.6,
        });
        setReverbEffect({
            effectType: 2,
            decay: 0.1,
        });
        setFilterEffect({
            effectType: 3,
            frequency: 100,
            type: 'lowpass',
            rolloff: -12,
        });
        setDistortionEffect({
            effectType: 4,
            distortionValue: 0.5,
        });
    }

    return {
        chorusEffect,
        tremoloEffect,
        reverbEffect,
        filterEffect,
        distortionEffect,
        synthType,
        handheSynthChange,
        handleChorusFrequencyChange,
        handleChorusDelayTimeChange,
        handleChorusDepthChange,
        handleTremoloFrequencyChange,
        handleTremoloDepthChange,
        handleReverbDecayChange,
        handleFilterFrequencyChange,
        handleFilterRolloffChange,
        handleDistortionValueChange,
        handleResetEffects
    };
};
