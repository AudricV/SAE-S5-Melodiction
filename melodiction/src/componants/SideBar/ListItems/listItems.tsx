import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AddIcon from '@mui/icons-material/Add';
import { Divider, Stack } from '@mui/material';
import { useState } from 'react';

interface Props {
  id: string;
  name: string;
}

const listMelody: Props[] = [
  { id: '1', name: 'Mélodie 1' },
  { id: '2', name: 'Mélodie 2' },
  { id: '3', name: 'Mélodie 3' },
];

const MainListItems = () => {
  const [melodyCount, setMelodyCount] = useState(listMelody.length + 1);

  const addNewMelody = () => {
    const newMelody = {
      id: melodyCount.toString(),
      name: 'Mélodie ' + melodyCount,
    };

    listMelody.push(newMelody);
    setMelodyCount(melodyCount + 1);
  };

  const listMelodyItems = listMelody.map((melody) => (
    <ListItemButton key={melody.id}>
      <ListItemIcon>
        <MusicNoteIcon />
      </ListItemIcon>
      <ListItemText primary={melody.name} />
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

      {listMelodyItems}

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