import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { BioDataProvider } from './context/BioDataContext';
import TitleScreen from './components/screens/TitleScreen';
import LevelScreen from './components/screens/LevelScreen';
import GameScreen from './components/screens/GameScreen';
import DataViewScreen from './components/screens/DataViewScreen';
import KnowledgeOverlay from './components/overlays/KnowledgeOverlay';
import ResultOverlay from './components/overlays/ResultOverlay';
import BgCanvas from './components/shared/BgCanvas';
import Toast from './components/shared/Toast';
import NarrativeBox from './components/shared/NarrativeBox';

function App() {
  const [screen, setScreen] = useState('title');

  return (
    <GameProvider>
      <BioDataProvider>
        <BgCanvas />
        <Toast />
        <NarrativeBox />

        {screen === 'title' && <TitleScreen onNavigate={setScreen} />}
        {screen === 'levels' && <LevelScreen onNavigate={setScreen} />}
        {screen === 'game' && <GameScreen onNavigate={setScreen} />}
        {screen === 'dataview' && <DataViewScreen onNavigate={setScreen} />}

        <KnowledgeOverlay />
        <ResultOverlay onNavigate={setScreen} />
      </BioDataProvider>
    </GameProvider>
  );
}

export default App;
