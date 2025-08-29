import { isKingInCheck, isMoveLeavingKingInCheck } from "./kingUtils";
import type { Board, Color, Coords, PieceType } from "./types";
import { BOARD_DIM, isValidSquare } from "./utils";
export function getSlideMoves(
  row: number,
  col: number,
  directions: Coords,
  board: Board
) {
  if (!board[row][col]?.color)
    throw new Error("Color not found (improper format).");
  const pieceColor: Color = board[row][col]?.color as Color;
  const moves = [];
  // i made the z let becuase dr and dc are the fake directions
  let z = -1;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [dr, dc] of directions) {
    z++;
    for (let i = 1; ; i++) {
      //when you move a crocodile make the directions let = crocodile direction
      if ((board[row][col]?.type as PieceType) == "C") {
        directions = [
          [0, 1],
          [(i - 1) / i, 1 / i],
          [(i - 1) / i, -1 / i],
          [0, -1],
          [(-i + 1) / i, -1 / i],
          [(-i + 1) / i, 1 / i],
        ];
      }
      //when you move an octopus make the directions let = octopus direction
      if ((board[row][col]?.type as PieceType) == "O") {
        if (i == 3) {
          break;
        }
        directions = [
          [-0.5 * (i + 1), -1 / i],
          [-0.5 * (i + 1), 1 / i],
          [0.5 * (i + 1), -1 / i],
          [0.5 * (i + 1), 1 / i],
          [-1 / i, -0.5 * (i + 1)],
          [1 / i, -0.5 * (i + 1)],
          [-1 / i, 0.5 * (i + 1)],
          [1 / i, 0.5 * (i + 1)],
        ];
      }
      // i represents distance from current piece.
      const newRow = row + directions[z][0] * i;
      const newCol = col + directions[z][1] * i;

      // If we're getting out of the board's boundaries then stop.
      if (!isValidSquare(newRow, newCol)) break;

      const targetPiece = board[newRow][newCol];
      // If it's an empty square then add it to the available moves and continue looping.
      if (targetPiece == null) {
        moves.push([newRow, newCol]);
      }
      // It it's of an other color, add it and stop looping.
      // else, it's of the same color. Don't add it and stop looping.
      else {
        if (targetPiece.color != pieceColor) {
          moves.push([newRow, newCol]);
          break;
        }
        break;
      }
    }
  }
  return moves;
}
export function getKingMoves(row: number, col: number, board: Board) {
  return getJumpingMoves(
    row,
    col,
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ],
    board
  );
}
export function getJumpingMoves(
  row: number,
  col: number,
  directions: Coords,
  board: Board
) {
  const pieceColor = board[row][col]?.color as Color;
  const moves = [] as Coords;
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (isValidSquare(newRow, newCol)) {
      const targetSquare = board[newRow][newCol];
      if (targetSquare == null || targetSquare.color != pieceColor) {
        moves.push([newRow, newCol]);
      }
    }
  }
  return moves;
}
export function getZSlideMoves(
  row: number,
  col: number,
  directions: Coords,
  board: Board
) {
  const pieceColor = board[row][col]?.color;
  const moves = [];
  let z = -1;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [dr, dc] of directions) {
    for (let i = 1; ; i++) {
      if (i == 1) {
        z++;
        directions = [
          [-1, -1],
          [-1, -1],
          [-1, 1],
          [-1, 1],
          [1, -1],
          [1, -1],
          [1, 1],
          [1, 1],
        ];
      }
      if (i >= 2 && (board[row][col]?.type as PieceType) == "Z") {
        directions = [
          [-1, -1], //main diagonal top left
          [-1, -(i - 1) / i], //second diagonal top left
          [-1, 1], //main diagonal top right
          [-(i - 1) / i, 1], //second diagonal top right
          [1, -1], //main diagonal bottom left
          [(i - 1) / i, -1], //second diagonal bottom left
          [1, 1], //main diagonal bottom right
          [1, (i - 1) / i], //second diagonal bottom right
        ];
      }
      // i represents distance from current piece.
      const newRow = row + directions[z][0] * i;
      const newCol = col + directions[z][1] * i;

      // If we're getting out of the board's boundaries then stop.
      if (!isValidSquare(newRow, newCol)) break;

      const targetPiece = board[newRow][newCol];
      // If it's an empty square then add it to the available moves and continue looping.
      if (targetPiece == null) moves.push([newRow, newCol]);
      // It it's of an other color, add it and stop looping.
      // else, it's of the same color. Don't add it and stop looping.
      else {
        if (targetPiece.color != pieceColor) {
          moves.push([newRow, newCol]);
          break;
        }
        break;
      }
    }
  }
  return moves;
}
export function getSSlideMoves(
  row: number,
  col: number,
  directions: Coords,
  board: Board
) {
  const pieceColor = board[row][col]?.color as Color;
  const moves = [];
  let z = -1;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [dr, dc] of directions) {
    z++;
    for (let i = 1; ; i++) {
      if (i % 2 == 0) {
        directions = [
          [-2, 0],
          [-2, 0],
          [0, 2],
          [0, 2],
          [0, -2],
          [0, -2],
          [2, 0],
          [2, 0],
        ];
      } else {
        directions = [
          [-2, -1 / i],
          [-2, 1 / i],
          [-1 / i, 2],
          [1 / i, 2],
          [-1 / i, -2],
          [1 / i, -2],
          [2, -1 / i],
          [2, 1 / i],
        ];
      }
      // i represents distance from current piece.
      const newRow = row + directions[z][0] * i;
      const newCol = col + directions[z][1] * i;
      // If we're getting out of the board's boundaries then stop.
      if (!isValidSquare(newRow, newCol)) break;

      const targetPiece = board[newRow][newCol];
      // If it's an empty square then add it to the available moves and continue looping.
      if (targetPiece == null) moves.push([newRow, newCol]);
      // It it's of an other color, add it and stop looping.
      // else, it's of the same color. Don't add it and stop looping.
      else {
        if (targetPiece.color != pieceColor) {
          moves.push([newRow, newCol]);
          break;
        }
        break;
      }
    }
  }
  return moves;
}
export function getRookMoves(row: number, col: number, board: Board) {
  const directions: Coords = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const moves = [...getSlideMoves(row, col, directions, board)];
  return moves;
}
export function getBishopMoves(row: number, col: number, board: Board) {
  const directions: Coords = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  const moves = [...getSlideMoves(row, col, directions, board)];
  return moves;
}
export function getKnightMoves(row: number, col: number, board: Board) {
  const directions: Coords = [
    [-2, -1],
    [-2, 1],
    [2, -1],
    [2, 1],
    [-1, -2],
    [1, -2],
    [-1, 2],
    [1, 2],
  ];
  return getJumpingMoves(row, col, directions, board);
}
export function getFrogMoves(row: number, col: number, board: Board) {
  const directions: Coords = [
    [4, -2],
    [4, -3],
    [5, -2],
    [5, -3],
    [-2, 4],
    [-3, 4],
    [-2, 5],
    [-3, 5],
    [-4, -2],
    [-4, -3],
    [-5, -2],
    [-5, -3],
    [-2, -4],
    [-3, -4],
    [-2, -5],
    [-3, -5],
    [-4, 2],
    [-4, 3],
    [-5, 2],
    [-5, 3],
    [2, -4],
    [3, -4],
    [2, -5],
    [3, -5],
    [4, 2],
    [4, 3],
    [5, 2],
    [5, 3],
    [2, 4],
    [3, 4],
    [2, 5],
    [3, 5],
  ];
  return getJumpingMoves(row, col, directions, board);
}
export function getZebraMoves(row: number, col: number, board: Board) {
  const directions: Coords = [
    [-1, -1],
    [-1, -1],
    [-1, 1],
    [-1, 1],
    [1, -1],
    [1, -1],
    [1, 1],
    [1, 1],
  ];
  const moves = [...getZSlideMoves(row, col, directions, board)];
  return moves;
}
export function getSnakeMoves(row: number, col: number, board: Board) {
  const directions: Coords = [
    [-2, -1],
    [-2, 1],
    [-1, 2],
    [1, 2],
    [-1, -2],
    [1, -2],
    [2, -1],
    [2, 1],
  ]; // Fake, btw
  const moves = [...getSSlideMoves(row, col, directions, board)];
  return moves;
}
export function getElephantMoves(row: number, col: number, board: Board) {
  return [...getRookMoves(row, col, board), ...getKnightMoves(row, col, board)];
}
export function getQueenMoves(row: number, col: number, board: Board) {
  let moves = [];
  const directions: Coords = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  moves = getSlideMoves(row, col, directions, board);
  return moves;
}
export function getCrocodileMoves(row: number, col: number, board: Board) {
  //i wrote any directions becuase i can't put the real dircetions here becuase i is not defiend
  const directions: Coords = [
    [0, 1],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 1],
  ];
  const moves = [...getSlideMoves(row, col, directions, board)];
  return moves;
}
export function getWallMoves(row: number, col: number, board: Board) {
  const directions: Coords = [
    [0, 2],
    [-1, 2],
    [-2, 2],
    [1, 2],
    [2, 2],
    [0, -3],
    [-1, -3],
    [-2, -3],
    [1, -3],
    [2, -3],
  ];
  if (board[row][col]?.color == "w") {
    directions.push(
      [-3, -3],
      [-3, -2],
      [-3, -1],
      [-3, 0],
      [-3, 1],
      [-3, 2],
      [2, -2],
      [2, -1],
      [2, 0],
      [2, 1]
    );
  } else {
    directions.push(
      [3, -3],
      [3, -2],
      [3, -1],
      [3, 0],
      [3, 1],
      [3, 2],
      [-2, -2],
      [-2, -1],
      [-2, 0],
      [-2, 1]
    );
  }
  return [...getJumpingMoves(row, col, directions, board)];
}
export function getPigeonMoves(row: number, col: number, board: Board) {
  return [
    ...getBishopMoves(row, col, board),
    ...getKnightMoves(row, col, board),
  ];
}
export function getOctopusMoves(row: number, col: number, board: Board) {
  let moves = [];
  //i wrote any directions becuase i can't put the real dircetions here becuase i is not defiend
  const directions: Coords = [
    [0, 1],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 1],
    [-1, -1],
    [-1, 1],
  ];
  moves = [...getSlideMoves(row, col, directions, board)];
  const Jumpdirections: Coords = [
    [-3, -2],
    [-3, 2],
    [3, -2],
    [3, 2],
    [-2, -3],
    [2, -3],
    [-2, 3],
    [2, 3],
  ];
  moves.push(...getJumpingMoves(row, col, Jumpdirections, board));
  return moves;
}
export function getPawnMoves(row: number, col: number, board: Board) {
  const moves: Coords = [];
  const pieceColor = board[row][col]?.color;
  const direction = pieceColor == "w" ? -1 : 1;
  if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
    moves.push([row + direction, col]);
    if (
      isValidSquare(row + 2 * direction, col) &&
      !board[row + 2 * direction][col]
    ) {
      moves.push([row + 2 * direction, col]);
    }
  }
  return [...moves, ...getPawnCaptures(row, col, board)];
}

function getPawnCaptures(row: number, col: number, board: Board) {
  const moves: Coords = [];
  const pieceColor = board[row][col]?.color;
  const direction = pieceColor == "w" ? -1 : 1;
  const enPassantRow = pieceColor == "w" ? 9 : 6;
  if (
    isValidSquare(row + direction, col - 1) &&
    board[row + direction][col - 1]! &&
    board[row + direction][col - 1]?.color !== pieceColor
  ) {
    moves.push([row + direction, col - 1]);
  }
  if (
    isValidSquare(row + direction, col + 1) &&
    board[row + direction][col + 1] &&
    board[row + direction][col + 1]?.color !== pieceColor
  ) {
    moves.push([row + direction, col + 1]);
  }
  if (
    isValidSquare(row, col - 1) &&
    board[row][col - 1] &&
    board[row][col - 1]?.color !== pieceColor &&
    row == enPassantRow
  ) {
    moves.push([row + direction, col - 1]);
  }
  if (
    isValidSquare(row, col + 1) &&
    board[row][col + 1] &&
    board[row][col + 1]?.color !== pieceColor &&
    row == enPassantRow
  ) {
    moves.push([row + direction, col + 1]);
  }
  return moves;
}

export function getCaptures(row: number, col: number, board: Board) {
  let moves: Coords = [];
  const selectedPiece = board[row][col]?.type;

  switch (selectedPiece) {
    case "R":
      moves = getRookMoves(row, col, board) as Coords;
      break;
    case "B":
      moves = getBishopMoves(row, col, board) as Coords;
      break;
    case "N":
      moves = getKnightMoves(row, col, board) as Coords;
      break;
    case "Z":
      moves = getZebraMoves(row, col, board) as Coords;
      break;
    case "p":
      moves = getPawnCaptures(row, col, board) as Coords;
      break;
    case "S":
      moves = getSnakeMoves(row, col, board) as Coords;
      break;
    case "Q":
      moves = getQueenMoves(row, col, board) as Coords;
      break;
    case "C":
      moves = getCrocodileMoves(row, col, board) as Coords;
      break;
    case "E":
      moves = getElephantMoves(row, col, board) as Coords;
      break;
    case "W":
      moves = getWallMoves(row, col, board) as Coords;
      break;
    case "P":
      moves = getPigeonMoves(row, col, board) as Coords;
      break;
    case "O":
      moves = getOctopusMoves(row, col, board) as Coords;
      break;
    case "F":
      moves = getFrogMoves(row, col, board) as Coords;
      break;
    case "K":
      moves = getKingMoves(row, col, board) as Coords;
      break;
    default:
      console.log("Not programmed yet.");
      break;
  }
  return moves;
}

export function getMoves(row: number, col: number, board: Board) {
  const moves = getCaptures(row, col, board);
  if ((board[row][col]?.type as PieceType) == "p")
    moves.push(...(getPawnMoves(row, col, board) as Coords));
  return moves;
}

export function getShortCastle(color: Color, board: Board) {
  const startingRow = color == "w" ? BOARD_DIM - 1 : 0;
  const kingCol = 7;
  let rook = false;
  let king = false;
  for (let i = BOARD_DIM - 1; i >= kingCol; i--) {
    const piece = board[startingRow][i];
    if (piece && piece.type != "K" && piece.type != "R") {
      console.log(piece);
      console.log("You can't short castle while other pieces are in the way.");
      return null;
    }
    if (piece && piece.type == "K" && !piece.hasMoved) king = true;
    if (piece && piece.type == "R" && !piece.hasMoved) rook = true;
    if (isKingInCheck(color, board)) {
      console.log("You can't short castle while king is in check.");
      return null;
    }
    if (
      isMoveLeavingKingInCheck(
        [startingRow, kingCol],
        [startingRow, kingCol + 1],
        board,
        color
      )
    ) {
      console.log("There can't be a piece controlling the way of castling");
      return null;
    }
    if (
      isMoveLeavingKingInCheck(
        [startingRow, kingCol],
        [startingRow, kingCol + 2],
        board,
        color
      )
    ) {
      console.log("Short Castling cannot leave you in check.");
      return null;
    }
    if (rook && king) {
      return [startingRow, kingCol + 3];
    }
  }
  return null;
}

export function getLongCastle(color: Color, board: Board) {
  const startingRow = color == "w" ? BOARD_DIM - 1 : 0;
  const kingCol = 7;
  let rook = false;
  let king = false;
  for (let i = 0; i <= kingCol; i++) {
    const piece = board[startingRow][i];
    if (piece && piece.type != "K" && piece.type != "R") {
      console.log("You can't long castle while other pieces are in the way.");
      return null;
    }
    if (piece && piece.type == "K" && !piece.hasMoved) king = true;
    if (piece && piece.type == "R" && !piece.hasMoved) rook = true;
    if (isKingInCheck(color, board)) {
      console.log("You can't long castle while in check.");
      return null;
    }
    if (
      isMoveLeavingKingInCheck(
        [startingRow, kingCol],
        [startingRow, kingCol - 1],
        board,
        color
      )
    ) {
      console.log("There can't be a piece controlling the way of castling");
      return null;
    }
    if (
      isMoveLeavingKingInCheck(
        [startingRow, kingCol],
        [startingRow, kingCol - 2],
        board,
        color
      )
    ) {
      console.log("You can't long castle while in check.");
      return null;
    }
    if (rook && king) {
      return [startingRow, kingCol - 4];
    }
  }
  return null;
}

export function getCastleMoves(color: Color, board: Board): Coords {
  const castleMoves: Coords = [
    getShortCastle(color, board),
    getLongCastle(color, board),
  ].filter((move) => move !== null) as Coords;
  return castleMoves as Coords;
}
