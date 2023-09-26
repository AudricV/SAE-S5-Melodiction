// @ts-ignore
import Main from '../../componants/MainInput/index'
import SideBar from '../../componants/SideBar/index'

export default function MainPage() {

    const renderComponent = () => <Main/>;

    return (
        <SideBar renderComponent={renderComponent} />
    );
}
