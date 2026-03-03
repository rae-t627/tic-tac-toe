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
    const [squares, setSquares] = React.useState(Array(9).fill(null))
    const [isX, setIsX] = React.useState(true) //alternate which letter to place on squares
    const [history, setHistory] = React.useState([])
    const [gameRecorded, setGameRecorded] = React.useState(false);
    const { addGame } = useGameHistory();
    let buttonClassName = "hidden";

    let winner = CalculateWinner(squares);
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

    const playAgain = () =>{
        setIsX(true);
        setSquares(Array(9).fill(null));
        setHistory([]);
        setGameRecorded(false);
    }

    const renderSquare = (i) =>{
        return <Square value = {squares[i]} onClick = {() => handleClick(i)} />
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
        <div className="board">
            <div className="turn-indicator">
                <span className={`turn-label ${!winner.winner && !winner.isDraw && isX ? 'active-x' : ''} ${winner.winner === 'X' ? 'active-x' : ''}`}>X</span>
                <span className={`turn-text ${indicatorClass ? 'game-over' : ''}`}>{turnIndicator}</span>
                <span className={`turn-label ${!winner.winner && !winner.isDraw && !isX ? 'active-o' : ''} ${winner.winner === 'O' ? 'active-o' : ''}`}>O</span>
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

            <div className="board-row pt-3">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row p-0">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row p-0">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    )
}

function CalculateWinner(squares){
    let winningPatterns = [
        [0, 1, 2], 
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    let isDraw = false;

    for (let i = 0; i < winningPatterns.length; i++){
        let [a, b, c] = winningPatterns[i];         //decontructing into a, b, c
        
        if (squares [a] === squares[b] && squares[a] === squares[c] && squares[a]){
            return {
                winner: squares[a],
                winningElements: winningPatterns[i],
                isDraw: false
            };
        }
    }
    isDraw = true;

    for (let i = 0; i < 9; i++){
        if (squares[i] === null){
            isDraw = false;
            break;
        }
    }
    return {
        winner: null,
        winningElements: null,
        isDraw: isDraw
    };
}