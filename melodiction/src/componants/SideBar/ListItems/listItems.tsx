import * as React from 'react';
import { useNavigate } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Melody from '../../../data/melody';
import { useState } from 'react';
import { Divider, List as MuiList, Tooltip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import LocalMelodiesStorage from '../../../data/storage/impl/local_melodies_storage';

const MainListItems = () => {
  const navigate = useNavigate();
  // TODO: better error handling
  const melodiesStorage = new LocalMelodiesStorage();

  const melodiesList: ReadonlyArray<Melody> = melodiesStorage.getMelodiesList()
    ?? ([] as ReadonlyArray<Melody>);

  const [melodyCount, setMelodyCount] = useState(melodiesStorage.getMelodiesCount() ?? 0);
  const [melodies, setMelodies] = useState(melodiesList);
  const [hoveredMelodyId, setHoveredMelodyId] = useState('' as string | null);

  const addNewMelody = () => {
    const newMelody = new Melody(
      uuidv4(),
      'Mélodie',
      'Texte de la mélodie',
      Date.now()
    );

    if (melodiesStorage.addMelody(newMelody)) {
      setMelodyCount(melodyCount + 1);
      setMelodies(melodies => [...melodies, newMelody]);
    } else {
      // TODO: better error handling
      console.error("Unable to add the new melody");
    }
  };

  const deleteMelody = (index: number) => {
    const updatedMelodies = melodies.filter((_, melodyIndex) => melodyIndex !== index);
    melodiesStorage.deleteMelody(index);
    setMelodies(updatedMelodies);
    setMelodyCount(updatedMelodies.length);
  };
  
  const listMelodyItems = melodies.map((melody) => (
    <ListItemButton key={melody.getId()}
      onMouseEnter={() => setHoveredMelodyId(melody.getId())}
      onMouseLeave={() => setHoveredMelodyId(null)}
      onClick={() => {
        const idMelody = melody.getId();
        navigate("/", { state: { idMelody } });
      }}
    >
      <ListItemIcon>
        <MusicNoteIcon />
      </ListItemIcon>
      <ListItemText primary={melody.getName()} />
      {hoveredMelodyId === melody.getId() && (
        <ListItemIcon
          style={{ justifyContent: 'flex-end' }}
          onClick={(event) => {
            event.stopPropagation();
            deleteMelody(melodies.indexOf(melody));
          }}
        >
          <Tooltip title="Supprimer la mélodie">
            <DeleteIcon />
          </Tooltip>
        </ListItemIcon>
      )}
    </ListItemButton>
  ));

  return (
    <React.Fragment>
      <ListItemButton onClick={addNewMelody}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Nouvelle mélodie" />
      </ListItemButton>

      <Divider />

      <ListSubheader component="div" inset>
        HISTORIQUE
      </ListSubheader>

      <MuiList style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
        {listMelodyItems}
      </MuiList>

      <Divider />

      <ListItemButton>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Paramètres" />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>
        <ListItemText primary="Aide" />
      </ListItemButton>

    </React.Fragment>
  );
};

export default MainListItems;