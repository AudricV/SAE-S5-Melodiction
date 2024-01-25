import { useEffect, useState } from "react";
import { IconButton, Paper, Tooltip } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import Melody from "../../data/melody";
import { tempo } from "../../hooks/manage_music";

type TextScreenProps = {
    melody: Melody;
    onEditClick: () => void;
    onTextChange: () => boolean;
    onMusicPlay: () => void;
    onMusicStop: () => void;
};

function TextScreen(props: TextScreenProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [editedMessage, setEditedMessage] = useState(props.melody.getMelodyText());

    useEffect(() => {
        setEditedMessage(props.melody.getMelodyText());
    }, [props.melody.getMelodyText()]);

    const handleEditClick = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedMessage(props.melody.getMelodyText());
    };

    return (
        <Paper sx={{ padding: "1rem", overflow: "auto" }}>
            {isEditing ? (
                <TextField
                    fullWidth
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                />
            ) : (
                <>
                    <p style={{ overflow: "auto" }}>{props.melody.getMelodyText()}</p>
                    {isPlaying ? (
                        <Tooltip title="Arrêter la lecture">
                            <IconButton onClick={() => {
                                setIsPlaying(false);
                                props.onMusicStop();
                            }
                            }>
                                <StopIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Lire la mélodie">
                            <IconButton onClick={() => {
                                setIsPlaying(true);
                                props.onMusicPlay();
                                setTimeout(() => {
                                    setIsPlaying(false);
                                }, props.melody.getMelodyText().length * (tempo * 2.5) * 1000);
                            }
                            }>
                                <PlayArrowIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            )}
            {isEditing ? (
                <>
                    <Tooltip title="Enregistrer les modifications">
                        <CheckIcon onClick={() => {
                            if (editedMessage.trim() === "") {
                                alert("Veuillez saisir un message valide");
                                return;
                            }
                            props.melody.setMelodyText(editedMessage);
                            if (props.onTextChange()) {
                                setIsEditing(false);
                            }
                        }} />
                    </Tooltip>
                    <Tooltip title="Annuler les modifications">
                        <CancelIcon onClick={handleCancelEdit} />
                    </Tooltip>
                </>
            ) : (
                <IconButton onClick={handleEditClick}>
                    <Tooltip title="Modifier la mélodie">
                        <EditIcon />
                    </Tooltip>
                </IconButton>
            )}

        </Paper>
    );
}

export default TextScreen;
