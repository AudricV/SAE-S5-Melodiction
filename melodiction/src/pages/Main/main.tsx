// @ts-ignore
import SideBar from '../../componants/SideBar/index'
import PageMain from './Components';

export default function MainPage() {

    const renderComponent = () => <PageMain />;

    return (
        <SideBar renderComponent={renderComponent} />
    );
}
