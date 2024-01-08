import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import { Divider, List as MuiList } from '@mui/material';
import { useMelodyStore } from '../../../store/melodyStore';
import MelodyItem from '../../../components/MelodyItem';
import { Link, useNavigate } from 'react-router-dom';
import { useManageMelody } from '../../../tools/manageMelody';

export const linkStyles = {
  textDecoration: 'none',
  outline: 'none',
  color: 'inherit',
};

const MainListItems = () => {
  const {
    melodiesStorage,
    handleMelodyNameChanged,
    handleMelodyDeleted
  } = useManageMelody();

  const { setSelectedMelody } = useMelodyStore();
  const navigate = useNavigate();
  // TODO: better error handling

  const listMelodyItems = melodiesStorage.getMelodiesList()?.map((melody, melodyIndex) => (
    <MelodyItem
      melody={melody}
      key={melody.getId()}
      onMelodyClicked={() => {
        setSelectedMelody(melody);
        navigate(`/melody/${melody.getId()}`);
      }}
      onMelodyNameChanged={() => handleMelodyNameChanged(melodyIndex, melody)}
      onMelodyDeleted={() => handleMelodyDeleted(melodyIndex)}
    />
  ));

  return (
    <React.Fragment>

      <Link to="/" style={linkStyles}>
        <ListItemButton>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Nouvelle mélodie" />
        </ListItemButton>
      </Link>

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

      <Link to="/" style={linkStyles}>
        <ListItemButton>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="test" />
        </ListItemButton>
      </Link>



    </React.Fragment>
  );
};

export default MainListItems;