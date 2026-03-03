import React from 'react';
import { useGameHistory } from './GameHistoryContext';
import { Link } from 'react-router-dom';

export const GameHistory = () => {
  const { history, clearHistory } = useGameHistory();

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Game History</h1>
      {history.length === 0 ? (
        <p className="dashboard-empty">
          No games played yet. <Link to="/">Go play some games!</Link>
        </p>
      ) : (
        <>
          <button className="clear-history-btn" onClick={clearHistory}>
            Clear History
          </button>
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mode</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((game, index) => (
                  <tr key={game.id}>
                    <td>{history.length - index}</td>
                    <td>{game.mode}</td>
                    <td
                      className={`result-${
                        game.winner === 'Draw'
                          ? 'draw'
                          : game.winner === 'X'
                          ? 'x'
                          : 'o'
                      }`}
                    >
                      {game.winner === 'Draw' ? 'Draw' : `${game.winner} Wins`}
                    </td>
                    <td>
                      {new Date(game.date).toLocaleDateString()}{' '}
                      {new Date(game.date).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
