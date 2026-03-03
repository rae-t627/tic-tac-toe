import React from 'react'
import { Square } from './Square'
import Image from "react-bootstrap/Image";
import restartButton from "../Images/restartButton.png"
import homeButton from "../Images/homeButton.png"
import { useGameHistory } from './GameHistoryContext';

import {
    Link,
  } from "react-router-dom";

let scores = {
    X: -1,
    O: 1,
    tie: 0
};

function getMaxDepth(size) {
    if (size <= 3) return 20;
    if (size === 4) return 6;
    return 4;
}

function minimax(squares, size, depth, maxDepth, isMaximising, alpha, beta) {
    let result = CalculateWinner(squares, size);

    if (result.winner !== null) return scores[result.winner];
    if (result.isDraw) return 0;
    if (depth >= maxDepth) return 0;

    const totalCells = size * size;

    if (isMaximising) {
        let bestScore = -Infinity;
        for (let i = 0; i < totalCells; i++) {
            if (squares[i] === null) {
                squares[i] = 'O';
                let score = minimax(squares, size, depth + 1, maxDepth, false, alpha, beta);
                squares[i] = null;
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < totalCells; i++) {
            if (squares[i] === null) {
                squares[i] = 'X';
                let score = minimax(squares, size, depth + 1, maxDepth, true, alpha, beta);
                squares[i] = null;
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    }
}

function computeBestMove(currentSquares, size) {
    let bestScore = -Infinity;
    let move;
    let array = [...currentSquares];
    const maxDepth = getMaxDepth(size);
    const totalCells = size * size;
    for (let i = 0; i < totalCells; i++) {
        if (array[i] == null) {
            array[i] = 'O';
            let score = minimax(array, size, 0, maxDepth, false, -Infinity, Infinity);
            array[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

export const WithAI = () => {
    const [boardSize, setBoardSize] = React.useState(3)
    const [squares, setSquares] = React.useState(Array(9).fill(null))
    const [isX, setIsX] = React.useState(true)
    const [history, setHistory] = React.useState([])
    const [moves, setMoves] = React.useState([])
    const [gameRecorded, setGameRecorded] = React.useState(false);
    const { addGame } = useGameHistory();
    let buttonClassName = "hidden";

    let winner = CalculateWinner(squares, boardSize);
    if (winner.winner){
        buttonClassName = "";
    }
    else if (winner.isDraw){
        buttonClassName = "";
    }

    React.useEffect(() => {
        if (!gameRecorded && (winner.winner || winner.isDraw)) {
            addGame("Human vs Computer", winner.winner || "Draw", moves, boardSize);
            setGameRecorded(true);
        }
    }, [winner.winner, winner.isDraw, gameRecorded, addGame, moves, boardSize]);

    // Computer moves after player's turn, with a short delay
    React.useEffect(() => {
        if (!isX && !winner.winner && !winner.isDraw) {
            const timer = setTimeout(() => {
                const move = computeBestMove(squares, boardSize);
                if (move !== undefined) {
                    setHistory(prev => [...prev, { squares: [...squares], isX: false }]);
                    setMoves(prev => [...prev, move]);
                    const newSquares = [...squares];
                    newSquares[move] = 'O';
                    setSquares(newSquares);
                    setIsX(true);
                }
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isX, squares, winner.winner, winner.isDraw, boardSize]);

    const handleClick = (i) => {
        if (winner.winner || winner.isDraw || squares[i] || !isX){
            return
        }
        setHistory(prev => [...prev, { squares: [...squares], isX: true }]);
        setMoves(prev => [...prev, i]);
        const newSquares = [...squares];
        newSquares[i] = 'X';
        setSquares(newSquares);
        setIsX(false);
    }

    const undoMove = () => {
        if (history.length < 2) return;
        const previousState = history[history.length - 2];
        setSquares(previousState.squares);
        setIsX(previousState.isX);
        setHistory(history.slice(0, -2));
        setMoves(moves.slice(0, -2));
    }

    const changeBoardSize = (size) => {
        setBoardSize(size);
        setSquares(Array(size * size).fill(null));
        setIsX(true);
        setHistory([]);
        setMoves([]);
        setGameRecorded(false);
    }

    const playAgain = () =>{
        setIsX(true);
        setSquares(Array(boardSize * boardSize).fill(null));
        setHistory([]);
        setMoves([]);
        setGameRecorded(false);
    }

    const renderSquare = (i) =>{
        return <Square key={i} value = {squares[i]} onClick = {() => handleClick(i)} />
    }
    
    let turnIndicator;
    let indicatorClass = '';
    if (winner.winner) {
        turnIndicator = winner.winner === 'X' ? "You Won!" : "You Lost!";
        indicatorClass = winner.winner === 'X' ? 'active-x' : 'active-o';
    } else if (winner.isDraw) {
        turnIndicator = "It's a Draw!";
    } else {
        turnIndicator = isX ? "Your Turn (X)" : "Computer's Turn (O)";
    }

    return(
        <div className={`board board-size-${boardSize}`}>
            <div className="turn-indicator">
                <span className={`turn-label ${!winner.winner && !winner.isDraw && isX ? 'active-x' : ''} ${winner.winner === 'X' ? 'active-x' : ''}`}>X</span>
                <span className={`turn-text ${indicatorClass ? 'game-over' : ''}`}>{turnIndicator}</span>
                <span className={`turn-label ${!winner.winner && !winner.isDraw && !isX ? 'active-o' : ''} ${winner.winner === 'O' ? 'active-o' : ''}`}>O</span>
            </div>
            <div className="size-selector">
                {[3, 4, 5].map(size => (
                    <button
                        key={size}
                        className={`size-btn ${boardSize === size ? 'size-btn-active' : ''}`}
                        onClick={() => changeBoardSize(size)}
                    >
                        {size}x{size}
                    </button>
                ))}
            </div>
            <div className="players">
                <p>Computer: O</p>
                <p>Player: X</p>
            </div>

            <div className='gameButtons'>
                <button className = {buttonClassName} onClick={playAgain}><Image src={restartButton} fluid style={{ maxHeight: "8vh", maxWidth:"30vw" }}/></button>
                <Link to="/">
                    <button className = {buttonClassName}><Image src={homeButton} fluid style={{ maxHeight: "8vh", maxWidth:"30vw"}}/></button>    
                </Link>
            </div>

            {!winner.winner && !winner.isDraw && isX && history.length >= 2 && (
                <div className="undo-container">
                    <button className="undo-btn" onClick={undoMove}>Undo Move</button>
                </div>
            )}

            {Array.from({ length: boardSize }, (_, row) => (
                <div className={`board-row ${row === 0 ? 'pt-3' : 'p-0'}`} key={row}>
                    {Array.from({ length: boardSize }, (_, col) => renderSquare(row * boardSize + col))}
                </div>
            ))}
        </div>
    )
}

function generateWinningPatterns(size) {
    const patterns = [];
    for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) row.push(r * size + c);
        patterns.push(row);
    }
    for (let c = 0; c < size; c++) {
        const col = [];
        for (let r = 0; r < size; r++) col.push(r * size + c);
        patterns.push(col);
    }
    const diag1 = [], diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    patterns.push(diag1, diag2);
    return patterns;
}

function CalculateWinner(squares, size) {
    const winningPatterns = generateWinningPatterns(size);

    for (let i = 0; i < winningPatterns.length; i++) {
        const pattern = winningPatterns[i];
        const first = squares[pattern[0]];
        if (first && pattern.every(idx => squares[idx] === first)) {
            return {
                winner: first,
                winningElements: pattern,
                isDraw: false
            };
        }
    }

    const isDraw = squares.every(s => s !== null);
    return {
        winner: null,
        winningElements: null,
        isDraw: isDraw
    };
}

