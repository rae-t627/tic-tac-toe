import React from 'react'
import { useGameHistory } from './GameHistoryContext';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { history } = useGameHistory();

  const totalGames = history.length;
  const xWins = history.filter(g => g.winner === 'X').length;
  const oWins = history.filter(g => g.winner === 'O').length;
  const draws = history.filter(g => g.winner === 'Draw').length;
  const hvhGames = history.filter(g => g.mode === 'Human vs Human').length;
  const hvcGames = history.filter(g => g.mode === 'Human vs Computer').length;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      {totalGames === 0 ? (
        <p className="dashboard-empty">No games played yet. <Link to="/">Go play some games!</Link></p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{totalGames}</span>
              <span className="stat-label">Total Games</span>
            </div>
            <div className="stat-card">
              <span className="stat-value result-x">{xWins}</span>
              <span className="stat-label">X Wins</span>
            </div>
            <div className="stat-card">
              <span className="stat-value result-o">{oWins}</span>
              <span className="stat-label">O Wins</span>
            </div>
            <div className="stat-card">
              <span className="stat-value result-draw">{draws}</span>
              <span className="stat-label">Draws</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{hvhGames}</span>
              <span className="stat-label">Human vs Human</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{hvcGames}</span>
              <span className="stat-label">Human vs Computer</span>
            </div>
          </div>
          <Link to="/history" className="view-history-link">View Full Game History →</Link>
        </>
      )}
    </div>
  )
}
