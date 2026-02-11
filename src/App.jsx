import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [screen, setScreen] = useState('start'); // 'start', 'game', 'result'
  const [score, setScore] = useState(0);

  const startGame = () => {
    setScreen('game');
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setScreen('result');
  };

  const restartGame = () => {
    setScore(0);
    setScreen('start');
  };

  return (
    <div className="w-full h-full min-h-screen overflow-hidden font-sans text-white relative">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <StartScreen onStart={startGame} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div
            key="game"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "anticipate" }}
          >
            <GameScreen onEnd={endGame} />
          </motion.div>
        )}

        {screen === 'result' && (
          <motion.div
            key="result"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <ResultScreen score={score} onRestart={restartGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
