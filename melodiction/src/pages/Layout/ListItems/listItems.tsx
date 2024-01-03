import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Divider, List as MuiList } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useMelodyStore } from '../../../store/melodyStore';
import LocalMelodiesStorage from '../../../data/storage/impl/local_melodies_storage';
import Melody from '../../../data/melody';
import MelodyItem from '../../../components/MelodyItem';
import { Link, useNavigate } from 'react-router-dom';

const MainListItems = () => {
  const { setSelectedMelody } = useMelodyStore();
  const navigate = useNavigate();
  // TODO: better error handling
  const melodiesStorage = new LocalMelodiesStorage();

  const melodiesList: ReadonlyArray<Melody> = melodiesStorage.getMelodiesList()
    ?? ([] as ReadonlyArray<Melody>);

  const [melodyCount, setMelodyCount] = useState(melodiesStorage.getMelodiesCount() ?? 0);
  const [melodies, setMelodies] = useState(melodiesList);

  const addNewMelody = () => {
    const newMelody = new Melody(
      uuidv4(),
      'Mélodie',
      'Texte de la mélodie' + (melodyCount + 1).toString(),
      Date.now()
    );

    if (melodiesStorage.addMelody(newMelody)) {
      setMelodyCount(prevCount => prevCount + 1);
      setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
      setSelectedMelody(newMelody);
      navigate(`/melody/${newMelody.getId()}`);
    } else {
      // TODO: better error handling
      console.error("Unable to add the new melody");
    }
  };

  const handleMelodyNameChanged = (melodyIndex: number, melody: Melody) => {
    if (melodiesStorage.updateMelody(melodyIndex, melody)) {
      setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
    } else {
    }
    return true;
  }

  const handleMelodyDeleted = (melodyIndex: number): boolean => {
    if (melodiesStorage.deleteMelody(melodyIndex)) {
      setMelodyCount(prevCount => prevCount - 1);
      setMelodies(melodiesStorage.getMelodiesList() ?? ([] as ReadonlyArray<Melody>));
      return true;
    } else {
      return false;
    }
  }

  const linkStyles = {
    textDecoration: 'none', // Supprime la décoration de texte
    outline: 'none', // Supprime le surlignage bleu
    color: 'inherit', // Garde la couleur du texte par défaut
  };

  const listMelodyItems = melodies.map((melody, melodyIndex) => (
    <Link to={`/melody/${melody.getId()}`} style={linkStyles} onClick={() => {
      setSelectedMelody(melody);
    }}>
      <MelodyItem
        melody={melody}
        key={melody.getId()}
        onMelodyNameChanged={() => handleMelodyNameChanged(melodyIndex, melody)}
        onMelodyDeleted={() => handleMelodyDeleted(melodyIndex)}
      />
    </Link>
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