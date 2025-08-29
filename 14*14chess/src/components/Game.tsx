// import { useState } from "react";
// import { initialBoard } from "../core/types";
// import Board from "./Board";
// import { GameContext } from "../context/GameContext";
import {
  initialBoard,
} from "../core/types";
import BoardWrapper from "./BoardWrapper";
import Board from "./Board";
import ResultDiv from "./ResultDiv";
import { Timer } from "./timer";
import {WhitePromotion} from "./Promotion";
import {BlackPromotion} from "./Promotion";
import { useGameState } from "../hooks/useGameState";
import PGN from "./Controls/MovesList";
import MovesControls from "./Controls/MovesControls";

export default function Game() {
  const {
    board,
    handleSquareClick,
    legalMoves,
    handleUndo,
    handleRedo,
    resignClick,
    promotePawn,
    history,
    currentTurn,
  } = useGameState();
  // const [selectedPiece, setSelectedPiece] = useState<ISelectedPiece | null>(
  //   localStorage.getItem("selectedPiece")
  //     ? JSON.parse(localStorage.getItem("selectedPiece")!)
  //     : null
  // );
  function clearLS(){
    localStorage.setItem('board' , JSON.stringify(initialBoard))
    localStorage.setItem('pgnArr' , JSON.stringify([]))
    localStorage.setItem('history' , JSON.stringify([]))
    localStorage.setItem('currentTurn' , 'w')
    localStorage.setItem('result' , '*')
    localStorage.setItem('moveIndex' , '-1')
    localStorage.setItem('Wtm' , JSON.stringify([20 , 0 , 0 , 0]))
    localStorage.setItem('Btm' , JSON.stringify([20 , 0 , 0 , 0]))
  }
  return (
    <>
    <BoardWrapper>
      <Timer
        currentTurn={currentTurn}
        mins={10}
        turn="b"
        onTimeEnd={() => console.log("Time ended")}
      />
      <Board
        board={board}
        onSquareClick={handleSquareClick}
        legalMoves={legalMoves}
      />
      <Timer
        currentTurn={currentTurn}
        mins={1}
        turn="w"
        onTimeEnd={() => console.log("Time ended")}
      />
    </BoardWrapper>
      <MovesControls
        onBackwardClick={handleUndo}
        onForwardClick={handleRedo}
        onResignClick={resignClick}
        turn={currentTurn}
      />
      <br/>
    </>
  );
}
