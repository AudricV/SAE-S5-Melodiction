import { Box, Slider, Typography } from "@mui/material";

type VerticalSliderProps = {
    name: string;
    value: number | undefined;
    defaultValue: number;
    max: number;
    min?: number;
    step?: number;
    onChange: (event: Event, newValue: number | number[]) => void;
    label: string;
    style?: React.CSSProperties;
};

/**
 *  A vertical slider component.
 * @param param0 Takes a name, value, defaultValue, max, step, onChange, label and style as props.
 *
 */
export const VerticalSlider: React.FC<VerticalSliderProps> = ({ name, value, defaultValue, max, min, step, onChange, label, style }) => {
    return (
        <Box sx={{ height: '100%', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
            <Slider
                name={name}
                value={value ?? 0}
                max={max}
                min={min}
                step={step}
                onChange={onChange}
                sx={{
                    '& input[type="range"]': {
                        WebkitAppearance: 'slider-vertical',
                    },
                }}
                orientation="vertical"
                defaultValue={defaultValue}
                aria-label={label}
                valueLabelDisplay="auto"
                onKeyDown={(event: React.KeyboardEvent) => {
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        event.preventDefault();
                    }
                }}
                style={style}
            />
            <Typography id="vertical-slider">{label}</Typography>
        </Box>
    );
};