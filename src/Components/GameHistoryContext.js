import React, { createContext, useContext, useState, useCallback } from 'react';

const GameHistoryContext = createContext();

export const useGameHistory = () => useContext(GameHistoryContext);

const STORAGE_KEY = 'ticTacToeGameHistory';

const loadHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const GameHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(loadHistory);

  const addGame = useCallback((mode, winner, moves = [], boardSize = 3) => {
    const game = {
      id: Date.now(),
      mode,
      winner,
      moves,
      boardSize,
      date: new Date().toISOString(),
    };
    setHistory((prev) => {
      const updated = [game, ...prev];
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return (
    <GameHistoryContext.Provider value={{ history, addGame, clearHistory }}>
      {children}
    </GameHistoryContext.Provider>
  );
};
