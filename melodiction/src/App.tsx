// @ts-ignore
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './pages/Layout';
import MelodyPage from './pages/Chat';


function App() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/" element={<Landing />} />
        <Route path="/melody/:id" element={<MelodyPage />} />
      </Route>
    </Routes>

  );
}

export default App;
