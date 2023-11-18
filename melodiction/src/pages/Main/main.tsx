// @ts-ignore
import SideBar from '../../componants/SideBar/index'
import { useLocation } from 'react-router-dom';
import PageMain from './Components';

export default function MainPage() {
    const location = useLocation();
    let idMelody = location.state?.idMelody || null;

    const renderComponent = () => <PageMain id={idMelody} />;

    return (
        <SideBar renderComponent={renderComponent} />
    );
}
