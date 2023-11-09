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
import Melody from '../../../data/melody';
import { useState } from 'react';
import { Divider, List as MuiList } from '@mui/material';


const listMelody = [
  new Melody('1', 'Mélodie 1', 'C4 D4 E4 F4 G4 A4 B4 C5', 2012),
  new Melody('2', 'Mélodie 2', "OUI", 87)
];

const MainListItems = () => {
  const navigate = useNavigate();

  const [melodyCount, setMelodyCount] = useState(listMelody.length);

  const addNewMelody = () => {

    const newMelodyCount = melodyCount + 1;
    const newMelody = new Melody(
      newMelodyCount.toString(),
      'UH ' + newMelodyCount,
      'rzijfeoai',
      new Date().getUTCMilliseconds()
    );
  
    listMelody.push(newMelody); 
    setMelodyCount(newMelodyCount);
  };

  const listMelodyItems = listMelody.map((melody) => (
      <ListItemButton key={melody.getId()} onClick={() => {
        navigate("/", {state: {melody} });
      }}
      >
        <ListItemIcon>
          <MusicNoteIcon />
        </ListItemIcon>
        <ListItemText primary={melody.getName()} />
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