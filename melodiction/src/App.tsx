import {Routes, Route} from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './pages/Layout';
import MelodyPage from './pages/Chat';
import LocalMelodiesStorage from "./data/storage/impl/local_melodies_storage";


function App() {
    const melodiesStorage = new LocalMelodiesStorage();
    return (
        <Routes>
            <Route element={<Layout melodiesStorage={melodiesStorage}/>}>
                <Route path="/" element={<Landing melodiesStorage={melodiesStorage}/>}/>
                <Route path="/melody/:id" element={<MelodyPage melodiesStorage={melodiesStorage}/>}/>
            </Route>
        </Routes>
    );
}

export default App;
