import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Divider, List as MuiList } from '@mui/material';

interface Props {
  id: string;
  name: string;
}

const listMelody: Props[] = [
  {
    id: '1',
    name: 'Mélodie 1',
  },
  {
    id: '2',
    name: 'Mélodie',
  },
];

const MainListItems = () => {
  const [melodyCount, setMelodyCount] = useState(listMelody.length);

  const addNewMelody = () => {
    const newMelodyCount = melodyCount + 1;
    const newMelody = {
      id: newMelodyCount.toString(),
      name: 'Mélodie ' + newMelodyCount,
    };

    listMelody.push(newMelody);
    setMelodyCount(newMelodyCount);
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

      <div style={{overflowX: 'hidden'}}>
        <MuiList style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
          {listMelodyItems}
        </MuiList>
      </div>

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