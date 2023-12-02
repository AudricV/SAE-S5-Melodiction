import './App.css';
import { MelodyProvider } from './context/melodyContetxt';
// @ts-ignore
import MainPage from './pages/Main/main';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <MelodyProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </MelodyProvider>
  );
}

export default App;
