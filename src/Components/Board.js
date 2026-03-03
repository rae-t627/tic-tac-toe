import React from 'react'
import { Square } from './Square'
import Image from "react-bootstrap/Image";
import restartButton from "../Images/restartButton.png"
import homeButton from "../Images/homeButton.png"
import { useGameHistory } from './GameHistoryContext';

import {
    Link,
  } from "react-router-dom";

export const Board = () => {
    const [boardSize, setBoardSize] = React.useState(3)
    const [squares, setSquares] = React.useState(Array(9).fill(null))
    const [isX, setIsX] = React.useState(true) //alternate which letter to place on squares
    const [history, setHistory] = React.useState([])
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
            addGame("Human vs Human", winner.winner || "Draw");
            setGameRecorded(true);
        }
    }, [winner.winner, winner.isDraw, gameRecorded, addGame]);
    
    const handleClick = (i) => {
        if (winner.winner || squares[i]){
            return
        }
        setHistory([...history, { squares: [...squares], isX }]);
        const newSquares = [...squares];
        newSquares[i] = isX? 'X' : 'O';
        setSquares(newSquares);
        setIsX(!isX);
    }

    const undoMove = () => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        setSquares(previous.squares);
        setIsX(previous.isX);
        setHistory(history.slice(0, -1));
    }

    const changeBoardSize = (size) => {
        setBoardSize(size);
        setSquares(Array(size * size).fill(null));
        setIsX(true);
        setHistory([]);
        setGameRecorded(false);
    }

    const playAgain = () =>{
        setIsX(true);
        setSquares(Array(boardSize * boardSize).fill(null));
        setHistory([]);
        setGameRecorded(false);
    }

    const renderSquare = (i) =>{
        return <Square key={i} value = {squares[i]} onClick = {() => handleClick(i)} />
    }
    
    let turnIndicator;
    let indicatorClass = '';
    if (winner.winner) {
        turnIndicator = "Winner: Player " + winner.winner + "!";
        indicatorClass = winner.winner === 'X' ? 'active-x' : 'active-o';
    } else if (winner.isDraw) {
        turnIndicator = "It's a Draw!";
    } else {
        turnIndicator = isX ? "Player X's Turn" : "Player O's Turn";
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
                <p>Player 1: X</p>
                <p>Player 2: O</p>
            </div>

            <div className='gameButtons'>
                <button className = {buttonClassName} onClick={playAgain}><Image src={restartButton} fluid style={{ maxHeight: "8vh", maxWidth:"30vw" }}/></button>
                <Link to="/">
                    <button className = {buttonClassName}><Image src={homeButton} fluid style={{ maxHeight: "8vh", maxWidth:"30vw"}}/></button>    
                </Link>
            </div>

            {!winner.winner && !winner.isDraw && history.length > 0 && (
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