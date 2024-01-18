import { useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, IconButton, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useAudioStore } from '../../store/effectsStore';
import { SynthType } from '../../tools/synth_types';
import { VerticalSlider } from './slider';
import { EffectType } from '../../tools/effect_types';
import { FilterRollOff } from 'tone';
import { useMelodyStore } from '../../store/melodyStore';
import Melody from '../../data/melody';
import { Effect } from '../../tools/effect';

type EffectsItemsProps = {
    melody: Melody;
    indexMelody: number;
    handheSynthChange: (synth: SynthType) => void;
    handleChorusFrequencyChange: (e: Event, value: number | number[]) => void;
    handleChorusDelayTimeChange: (e: Event, value: number | number[]) => void;
    handleChorusDepthChange: (e: Event, value: number | number[]) => void;
    handleTremoloFrequencyChange: (e: Event, value: number | number[]) => void;
    handleTremoloDepthChange: (e: Event, value: number | number[]) => void;
    handleReverbDecayChange: (e: Event, value: number | number[]) => void;
    handleFilterFrequencyChange: (e: Event, value: number | number[]) => void;
    handleFilterRolloffChange: (e: Event, value: number | number[]) => void;
    handleDistortionValueChange: (e: Event, value: number | number[]) => void;
    handleResetEffects: () => void;
}

/**
 * Regroup all the effects in a drawer
 */
export default function EffectsItems(props: EffectsItemsProps) {
    const isMusicDrawerOpen = localStorage.getItem('stateEffectDrawer');
    const [open, setOpen] = useState(isMusicDrawerOpen === 'true');
    const { selectedMelody, setSelectedMelody } = useMelodyStore();

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

    const toggleDrawer = () => {
        setOpen(!open);
        localStorage.setItem('stateEffectDrawer', JSON.stringify(!open));
    };


    /**
     * 
     * @param effects effects to be applied to the melody
     */
    const handleEffectsChange = (effects: Map<SynthType, Effect[]>) => {
        const effectsMap = new Map<SynthType, Effect[]>();
        effectsMap.set(synthType, effects.get(synthType) ?? []);
        setSelectedMelody(new Melody(
            selectedMelody?.getId() ?? "",
            selectedMelody?.getName() ?? "",
            selectedMelody?.getMelodyText() ?? "",
            selectedMelody?.getLastModifiedTimestamp() ?? 0,
            effectsMap));
    }

    useEffect(() => {
        handleEffectsChange(new Map<SynthType, Effect[]>()
            .set(synthType, [
                chorusEffect,
                tremoloEffect,
                reverbEffect,
                filterEffect,
                distortionEffect
            ]));
    }, [chorusEffect, tremoloEffect, reverbEffect, filterEffect, distortionEffect, synthType]);


    return (
        <div>
            {open ?
                (
                    <Box>
                        <IconButton onClick={toggleDrawer}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        <Box sx={{ height: 50, flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '10px' }}>
                            <Select
                                value={synthType}
                                label="Synth"
                                onChange={(event: SelectChangeEvent<SynthType>) => {
                                    setSynthType(event.target.value as SynthType);
                                    console.log(event.target.value);
                                }}
                            >
                                <MenuItem value={SynthType.SYNTH}>Synth</MenuItem>
                                <MenuItem value={SynthType.FM_SYNTH}>FM_SYNTH</MenuItem>
                                <MenuItem value={SynthType.PLUCK}>PLUCK</MenuItem>

                            </Select>
                        </Box>
                        <Box sx={{ height: 120, flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '10px' }}>
                            <Box
                                sx={{
                                    height: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'space-evenly',
                                    alignItems: 'center', border: '2px solid gray', borderRadius: '7%'
                                }} >
                                <Typography id="vertical-slider" style={{ marginBottom: '10px' }}>Chorus</Typography>
                                <Box sx={{ height: '90%', display: 'flex', justifyContent: 'space-between' }}>
                                    <VerticalSlider
                                        name='frequency'
                                        value={chorusEffect.frequency ?? 10}
                                        max={50}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleChorusFrequencyChange(e, newValue);
                                        }}
                                        label="Frequency"
                                        defaultValue={10}
                                    />
                                    <VerticalSlider
                                        name='depth'
                                        value={chorusEffect.depth ?? 0.0}
                                        max={1.0}
                                        step={0.1}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleChorusDepthChange(e, newValue);
                                        }}
                                        label="Depth"
                                        defaultValue={0.0}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    height: '100%', flexDirection: 'column', display: 'flex',
                                    justifyContent: 'space-evenly', alignItems: 'center', border: '2px solid gray', borderRadius: '7%'
                                }} >
                                <Typography id="vertical-slider" style={{ marginBottom: '10px' }}>Tremolo</Typography>
                                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
                                    <VerticalSlider
                                        name='frequency'
                                        value={tremoloEffect.frequency ?? 10}
                                        max={50}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleTremoloFrequencyChange(e, newValue);
                                        }}
                                        label="Frequency"
                                        defaultValue={10}
                                    />
                                    <VerticalSlider
                                        name='depth'
                                        value={tremoloEffect.depth ?? 0.0}
                                        max={1.0}
                                        step={0.1}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleTremoloDepthChange(e, newValue);
                                        }}
                                        label="Depth"
                                        defaultValue={0.0}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ height: 120, flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '10px' }}>
                            <Box
                                sx={{
                                    height: '100%', flexDirection: 'column', display: 'flex',
                                    justifyContent: 'space-evenly', alignItems: 'center', border: '2px solid gray', borderRadius: '7%'
                                }} >
                                <Typography id="vertical-slider" style={{ marginBottom: '10px' }} >Filter</Typography>
                                <Box sx={{ height: '100%', display: 'flex' }}>
                                    <VerticalSlider
                                        name='frequency'
                                        value={filterEffect.frequency ?? 10}
                                        max={50}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleFilterFrequencyChange(e, newValue);
                                        }}
                                        label="Frequency"
                                        defaultValue={10}
                                    />
                                    <VerticalSlider
                                        name='rolloff'
                                        value={filterEffect.rolloff ?? -12}
                                        max={-96}
                                        step={-12}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleFilterRolloffChange(e, newValue);
                                        }}
                                        label="RollOff"
                                        defaultValue={0.0}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    height: '100%', flexDirection: 'column', display: 'flex',
                                    justifyContent: 'space-evenly', alignItems: 'center', border: '2px solid gray', borderRadius: '7%'
                                }} >
                                <Typography id="vertical-slider" style={{ marginBottom: '10px' }}>Distorsion</Typography>
                                <Box sx={{ height: '100%', display: 'flex' }}>
                                    <VerticalSlider
                                        name='distortionValue'
                                        value={distortionEffect.distortionValue ?? 0.0}
                                        max={1.0}
                                        step={0.1}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleDistortionValueChange(e, newValue);
                                        }}
                                        label="Amount"
                                        defaultValue={0.0}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    height: '100%', flexDirection: 'column', display: 'flex',
                                    justifyContent: 'space-evenly', alignItems: 'center', border: '2px solid gray', borderRadius: '7%'
                                }} >
                                <Typography id="vertical-slider" style={{ marginBottom: '10px' }}>Reverb</Typography>
                                <Box sx={{ height: '100%', display: 'flex' }}>
                                    <VerticalSlider
                                        name='reverbValue'
                                        value={reverbEffect.decay ?? 0.01}
                                        max={30}
                                        onChange={(e: Event, newValue: number | number[]) => {
                                            props.handleReverbDecayChange(e, newValue);
                                        }}
                                        label="Decay"
                                        defaultValue={0.0}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ flexDirection: 'row', display: 'flex', alignContent: 'center', justifyContent: 'space-evenly' }}>
                            <Button variant="contained" onClick={() => {
                                props.handleResetEffects();
                            }}>Reset</Button>
                        </Box>
                    </Box>
                )
                :
                (<IconButton onClick={toggleDrawer}>
                    <KeyboardArrowUpIcon />
                </IconButton>)
            }
        </div>
    );
};