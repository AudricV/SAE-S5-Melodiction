// @ts-ignore
import SideBar from '../../componants/SideBar/index'
import { useLocation } from 'react-router-dom';
import PageMain from './Components';
import Melody from '../../data/melody';

export default function MainPage() {
    const location = useLocation();
    let melodyPageMain = location.state?.melody || null;

    if (melodyPageMain) {
        melodyPageMain = new Melody(
            melodyPageMain.id,
            melodyPageMain.name,
            melodyPageMain.melodyText,
            melodyPageMain.lastModifiedTimestamp
        );
    }

    const renderComponent = () => <PageMain melody={melodyPageMain} />;

    return (
        <SideBar renderComponent={renderComponent} />
    );
}
