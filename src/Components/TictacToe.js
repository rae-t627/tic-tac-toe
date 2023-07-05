import React from 'react'
import { Board } from './Board.js';
import { WithAI } from './withAI.js';

export const TicTacToe = () => {
  return (
    <div className="tictactoe">
      <WithAI />
    </div>
  )
}
