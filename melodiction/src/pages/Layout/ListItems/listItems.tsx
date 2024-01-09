import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import { Divider, List as MuiList } from '@mui/material';
import MelodyItem from '../../../components/MelodyItem';
import { Link } from 'react-router-dom';
import { useManageMelody } from '../../../hooks/manage_melody_item';
import Melody from '../../../data/melody';
import MelodiesStorage from "../../../data/storage/melodies_storage";

export const linkStyles = {
    textDecoration: 'none',
    outline: 'none',
    color: 'inherit',
};

export type MainListItemsProps = {
    melodiesStorage: MelodiesStorage
}

const MainListItems = ({melodiesStorage}: MainListItemsProps) => {
    const {
        handleMelodyNameChanged,
        handleMelodyClicked,
        handleMelodyDeleted
    } = useManageMelody(melodiesStorage);

    const listMelodyItems = melodiesStorage.getMelodiesList()?.map((melody: Melody, melodyIndex: number) => (
    <MelodyItem
      melody={melody}
      key={melody.getId()}
      onMelodyClicked={() => handleMelodyClicked(melodyIndex)}
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