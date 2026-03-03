import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGameHistory } from './GameHistoryContext';
import { Square } from './Square';

function buildBoardAtStep(moves, step, boardSize) {
    const squares = Array(boardSize * boardSize).fill(null);
    for (let i = 0; i < step; i++) {
        squares[moves[i]] = i % 2 === 0 ? 'X' : 'O';
    }
    return squares;
}

export const GameReplay = () => {
    const { gameId } = useParams();
    const { history } = useGameHistory();
    const game = history.find(g => String(g.id) === gameId);
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const stopPlayback = useCallback(() => setIsPlaying(false), []);

    React.useEffect(() => {
        if (!isPlaying || !game) return;
        if (step >= game.moves.length) {
            setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setStep(s => s + 1), 700);
        return () => clearTimeout(timer);
    }, [isPlaying, step, game]);

    if (!game || !game.moves || game.moves.length === 0) {
        return (
            <div className="dashboard">
                <h1 className="dashboard-title">Game Replay</h1>
                <p className="dashboard-empty">
                    No replay data available for this game.{' '}
                    <Link to="/history">Back to History</Link>
                </p>
            </div>
        );
    }

    const boardSize = game.boardSize || 3;
    const squares = buildBoardAtStep(game.moves, step, boardSize);
    const totalMoves = game.moves.length;

    const handlePlay = () => {
        if (step >= totalMoves) setStep(0);
        setIsPlaying(true);
    };

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Game Replay</h1>
            <p className="replay-info">
                {game.mode} &mdash;{' '}
                <span className={`result-${game.winner === 'Draw' ? 'draw' : game.winner === 'X' ? 'x' : 'o'}`}>
                    {game.winner === 'Draw' ? 'Draw' : `${game.winner} Wins`}
                </span>
            </p>

            <div className={`board board-size-${boardSize} replay-board`}>
                {Array.from({ length: boardSize }, (_, row) => (
                    <div className={`board-row ${row === 0 ? 'pt-3' : 'p-0'}`} key={row}>
                        {Array.from({ length: boardSize }, (_, col) => {
                            const idx = row * boardSize + col;
                            return <Square key={idx} value={squares[idx]} onClick={() => {}} />;
                        })}
                    </div>
                ))}
            </div>

            <div className="replay-controls">
                <button className="replay-btn" onClick={() => { stopPlayback(); setStep(0); }} disabled={step === 0 && !isPlaying}>
                    ⏮
                </button>
                <button className="replay-btn" onClick={() => { stopPlayback(); setStep(s => Math.max(0, s - 1)); }} disabled={step === 0}>
                    ◀
                </button>
                {isPlaying ? (
                    <button className="replay-btn" onClick={stopPlayback}>⏸</button>
                ) : (
                    <button className="replay-btn" onClick={handlePlay} disabled={step >= totalMoves}>▶</button>
                )}
                <button className="replay-btn" onClick={() => { stopPlayback(); setStep(s => Math.min(totalMoves, s + 1)); }} disabled={step >= totalMoves}>
                    ▶
                </button>
                <button className="replay-btn" onClick={() => { stopPlayback(); setStep(totalMoves); }} disabled={step >= totalMoves}>
                    ⏭
                </button>
            </div>
            <p className="replay-step">Move {step} / {totalMoves}</p>

            <Link to="/history" className="replay-back-link">← Back to History</Link>
        </div>
    );
};
