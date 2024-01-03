import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from "@mui/material/Tooltip";
import Melody from "../../data/melody";
import TextField from "@mui/material/TextField";
import "./style.css";

/**
 * The props properties of a {@link MelodyItem}.
 */
export type MelodyItemProps = {
    /**
     * The {@link Melody} of the item.
     */
    melody: Melody,

    /**
     * A callback invoked when a melody name has been changed.
     *
     * @remarks
     *
     * This callback must be used to save changes to the melody in the melodies storage.
     *
     * If saving changes to the melody's name didn't succeed, an error message will be shown to the
     * user.
     * 
     * No exception must be thrown by this callback.
     *
     * @returns whether the melody name change has been saved
     */
    onMelodyNameChanged(): boolean,

    /**
     * A callback invoked when a melody wants to be deleted.
     *
     * @remarks
     *
     * This callback must be used to delete the melody in the melodies storage.
     *
     * If deleting the melody didn't succeed, an error message will be shown to the user.
     * 
     * No exception must be thrown by this callback.
     *
     * @returns whether the melody has been deleted
     */
    onMelodyDeleted(): boolean

    onMelodyClicked(): void
}

/**
 * The state properties of a {@link MelodyItem}.
 */
type MelodyItemState = {
    /**
     * Whether the name of melody is being edited.
     */
    isEditingMelodyName: boolean,

    /**
     * The new name of melody, i.e. the name typed by the user.
     */
    editingName: string
}

/**
 * React component for a melody item.
 */
export default class MelodyItem extends React.Component<MelodyItemProps, MelodyItemState> {
    constructor(props: MelodyItemProps) {
        super(props);
        this.state = {
            isEditingMelodyName: false,
            editingName: ""
        };
    }

    render() {
        return (
            <ListItemButton className="melody_item">
                <MusicNoteIcon className="melody_icon" />
                {this.state.isEditingMelodyName ?
                    (<TextField
                        fullWidth={true}
                        className="melody_edit_name_textfield"
                        label="Nouveau nom de la mélodie"
                        variant="standard"
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                            this.setState({ editingName: event.target.value })} />) :
                    (<ListItemText
                        className="melody_text"
                        primary={this.props.melody.getName()}
                        onClick={() => {
                            this.props.onMelodyClicked();
                        }} />)
                }
                {this.state.isEditingMelodyName ?
                    (<Tooltip title="Valider le changement de nom de la mélodie">
                        <CheckIcon
                            className="melody_confirm_new_name_icon"
                            onClick={(event) => {
                                // Prevent click on the main component
                                event.stopPropagation();

                                if (this.state.editingName.length == 0) {
                                    // TODO: better error handling
                                    alert("Veuillez saisir un nom de mélodie valide");
                                    return;
                                }

                                this.props.melody.setName(this.state.editingName);
                                if (this.props.onMelodyNameChanged()) {
                                    this.setState({
                                        isEditingMelodyName: false
                                    });
                                } else {
                                    // TODO: better error handling
                                    alert("Impossible de valider les changements. Veuillez réessayer.");
                                }
                            }} />
                    </Tooltip>) :
                    (<Tooltip title="Modifier le nom de la mélodie">
                        <ModeEditIcon
                            className="melody_edit_name_icon"
                            onClick={(event) => {
                                // Prevent click on the main component
                                event.stopPropagation();

                                this.setState({
                                    isEditingMelodyName: true
                                });
                            }} />
                    </Tooltip>)
                }
                {this.state.isEditingMelodyName ?
                    (<Tooltip title="Annuler le changement de nom de la mélodie">
                        <CancelIcon
                            className="melody_cancel_new_name_icon"
                            onClick={(event) => {
                                // Prevent click on the main component
                                event.stopPropagation();
                                this.setState({
                                    isEditingMelodyName: false
                                });
                            }} />
                    </Tooltip>) :
                    (<Tooltip title="Supprimer la mélodie">
                        <DeleteIcon
                            className="delete_melody_icon"
                            onClick={(event) => {
                                // Prevent click on the main component
                                event.stopPropagation();
                                if (!this.props.onMelodyDeleted()) {
                                    // TODO: better error handling
                                    alert("Impossible de valider les changements. Veuillez réessayer.");
                                }
                            }} />
                    </Tooltip>)
                }
            </ListItemButton>
        );
    }
}