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

function minimax(squares, depth, isMaximising){
    let result = CalculateWinner(squares);

    if (result.winner !== null){
        return scores[result.winner]
    }
    else if(result.isDraw !== false){
        return 0;
    }

    if (isMaximising){
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++){
            if (squares[i] === null){
                squares[i] = 'O'
                let score = minimax(squares, depth + 1, false);
                squares[i] = null;
                if (score > bestScore){
                    bestScore = score;
                }
            }
        }
        return bestScore;
    }
    else{
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++){
            if (squares[i] === null){
                squares[i] = 'X'
                let score = minimax(squares, depth + 1, true);
                squares[i] = null;
                if (score < bestScore){
                    bestScore = score;
                }
            }
        }
        return bestScore;
    }    
}

function computeBestMove(currentSquares){
    let bestScore = -Infinity;
    let move;
    let array = [...currentSquares];
    for (let i = 0; i < 9; i++){
        if (array[i] == null){
            array[i] = 'O';
            let score = minimax(array, 0, false);
            array[i] = null;
            if (score > bestScore){
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

export const WithAI = () => {
    const [squares, setSquares] = React.useState(Array(9).fill(null))
    const [isX, setIsX] = React.useState(true)
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
            addGame("Human vs Computer", winner.winner || "Draw");
            setGameRecorded(true);
        }
    }, [winner.winner, winner.isDraw, gameRecorded, addGame]);

    // Computer moves after player's turn, with a short delay
    React.useEffect(() => {
        if (!isX && !winner.winner && !winner.isDraw) {
            const timer = setTimeout(() => {
                const move = computeBestMove(squares);
                if (move !== undefined) {
                    setHistory(prev => [...prev, { squares: [...squares], isX: false }]);
                    const newSquares = [...squares];
                    newSquares[move] = 'O';
                    setSquares(newSquares);
                    setIsX(true);
                }
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isX, squares, winner.winner, winner.isDraw]);

    const handleClick = (i) => {
        if (winner.winner || winner.isDraw || squares[i] || !isX){
            return
        }
        setHistory(prev => [...prev, { squares: [...squares], isX: true }]);
        const newSquares = [...squares];
        newSquares[i] = 'X';
        setSquares(newSquares);
        setIsX(false);
    }

    const undoMove = () => {
        if (history.length < 2) return;
        // Undo both AI move and player move
        const previousState = history[history.length - 2];
        setSquares(previousState.squares);
        setIsX(previousState.isX);
        setHistory(history.slice(0, -2));
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
        turnIndicator = winner.winner === 'X' ? "You Won!" : "You Lost!";
        indicatorClass = winner.winner === 'X' ? 'active-x' : 'active-o';
    } else if (winner.isDraw) {
        turnIndicator = "It's a Draw!";
    } else {
        turnIndicator = isX ? "Your Turn (X)" : "Computer's Turn (O)";
    }

    return(
        <div className="board">
            <div className="turn-indicator">
                <span className={`turn-label ${!winner.winner && !winner.isDraw && isX ? 'active-x' : ''} ${winner.winner === 'X' ? 'active-x' : ''}`}>X</span>
                <span className={`turn-text ${indicatorClass ? 'game-over' : ''}`}>{turnIndicator}</span>
                <span className={`turn-label ${!winner.winner && !winner.isDraw && !isX ? 'active-o' : ''} ${winner.winner === 'O' ? 'active-o' : ''}`}>O</span>
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
        let [a, b, c] = winningPatterns[i];         //deconstructing into a, b, c
        
        if (squares[a] === squares[b] && squares[a] === squares[c] && squares[a]){
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

