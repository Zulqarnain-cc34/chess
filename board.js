const BOARD_SIZE = 8;
const FILES = Object.freeze(["a", "b", "c", "d", "e", "f", "g", "h"]);
const RANKS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]);
const WHITE_BACK_RANK = 1;
const WHITE_PAWN_RANK = 2;
const BLACK_BACK_RANK = 8;
const BLACK_PAWN_RANK = 7;

const PIECE_SYMBOLS = Object.freeze({
  white: Object.freeze({
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  }),
  black: Object.freeze({
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  }),
});

class ChessPiece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.symbol = PIECE_SYMBOLS[color][type];
  }
}

class ChessSquare {
  constructor(file, rank) {
    if (!ChessBoard.isValidFile(file) || !ChessBoard.isValidRank(rank)) {
      throw new Error(`Invalid square: ${file}${rank}`);
    }

    this.file = file;
    this.rank = rank;
    this.name = `${file}${rank}`;
    this.color = ChessBoard.getSquareColor(file, rank);
    this.piece = null;
  }

  isOccupied() {
    return this.piece !== null;
  }

  placePiece(piece) {
    this.piece = piece;
  }
}

class ChessBoard {
  constructor() {
    this.width = BOARD_SIZE;
    this.height = BOARD_SIZE;
    this.files = FILES;
    this.ranks = RANKS;
    this.squares = this.createSquares();
    this.setupInitialPosition();
  }

  static isValidFile(file) {
    return FILES.includes(file);
  }

  static isValidRank(rank) {
    return Number.isInteger(rank) && rank >= 1 && rank <= BOARD_SIZE;
  }

  static getSquareColor(file, rank) {
    const fileIndex = FILES.indexOf(file);
    const rankIndex = rank - 1;
    return (fileIndex + rankIndex) % 2 === 0 ? "dark" : "light";
  }

  createSquares() {
    const squares = new Map();

    for (const rank of RANKS) {
      for (const file of FILES) {
        const square = new ChessSquare(file, rank);
        squares.set(square.name, square);
      }
    }

    return squares;
  }

  setupInitialPosition() {
    this.clearPieces();
    this.setupBackRank("white", WHITE_BACK_RANK);
    this.setupPawns("white", WHITE_PAWN_RANK);
    this.setupBackRank("black", BLACK_BACK_RANK);
    this.setupPawns("black", BLACK_PAWN_RANK);
  }

  clearPieces() {
    for (const square of this.squares.values()) {
      square.placePiece(null);
    }
  }

  setupBackRank(color, rank) {
    const backRankPieces = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];

    backRankPieces.forEach((type, fileIndex) => {
      this.placePiece(FILES[fileIndex], rank, new ChessPiece(type, color));
    });
  }

  setupPawns(color, rank) {
    for (const file of FILES) {
      this.placePiece(file, rank, new ChessPiece("pawn", color));
    }
  }

  placePiece(file, rank, piece) {
    this.getSquare(file, rank).placePiece(piece);
  }

  movePiece(fromSquareName, toSquareName) {
    const fromSquare = this.getSquareByName(fromSquareName);
    const toSquare = this.getSquareByName(toSquareName);

    toSquare.placePiece(fromSquare.piece);
    fromSquare.placePiece(null);
  }

  getSquare(file, rank) {
    const square = this.squares.get(`${file}${rank}`);

    if (!square) {
      throw new Error(`Square does not exist: ${file}${rank}`);
    }

    return square;
  }

  getSquareByName(squareName) {
    if (typeof squareName !== "string" || squareName.length !== 2) {
      throw new Error(`Invalid square name: ${squareName}`);
    }

    const file = squareName[0];
    const rank = Number(squareName[1]);
    return this.getSquare(file, rank);
  }

  hasClearPath(fromSquare, toSquare) {
    return this.getClearPathTrace(fromSquare.name, toSquare.name).isClear;
  }

  getClearPathTrace(fromSquareName, toSquareName) {
    const fromSquare = this.getSquareByName(fromSquareName);
    const toSquare = this.getSquareByName(toSquareName);
    const fileStep = Math.sign(FILES.indexOf(toSquare.file) - FILES.indexOf(fromSquare.file));
    const rankStep = Math.sign(toSquare.rank - fromSquare.rank);
    let fileIndex = FILES.indexOf(fromSquare.file) + fileStep;
    let rank = fromSquare.rank + rankStep;
    const checkedSquares = [];

    while (FILES[fileIndex] !== toSquare.file || rank !== toSquare.rank) {
      const square = this.getSquare(FILES[fileIndex], rank);

      checkedSquares.push({
        square: square.name,
        occupied: square.isOccupied(),
        piece: square.piece ? `${square.piece.color} ${square.piece.type}` : null,
      });

      if (square.isOccupied()) {
        return {
          from: fromSquare.name,
          to: toSquare.name,
          fileStep,
          rankStep,
          checkedSquares,
          blockingSquare: square.name,
          isClear: false,
        };
      }

      fileIndex += fileStep;
      rank += rankStep;
    }

    return {
      from: fromSquare.name,
      to: toSquare.name,
      fileStep,
      rankStep,
      checkedSquares,
      blockingSquare: null,
      isClear: true,
    };
  }

  printClearPathDebug(fromSquareName, toSquareName) {
    const trace = this.getClearPathTrace(fromSquareName, toSquareName);

    console.log(`Path ${trace.from} -> ${trace.to}`);
    console.log(`fileStep: ${trace.fileStep}, rankStep: ${trace.rankStep}`);
    console.table(trace.checkedSquares);
    console.log(trace.isClear ? "Path is clear." : `Path is blocked at ${trace.blockingSquare}.`);

    return trace;
  }

  getDisplaySquares(perspective = "white") {
    const ranks = perspective === "white" ? [...RANKS].reverse() : [...RANKS];
    const files = perspective === "white" ? [...FILES] : [...FILES].reverse();

    return ranks.map((rank) => files.map((file) => this.getSquare(file, rank)));
  }

  getPieceCounts() {
    const counts = {
      white: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
      black: { king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 },
    };

    for (const square of this.squares.values()) {
      if (square.piece) {
        counts[square.piece.color][square.piece.type] += 1;
      }
    }

    return counts;
  }
}

class ChessGame {
  constructor() {
    this.board = new ChessBoard();
    this.sideToMove = "white";  // White always moves first. Players then alternate turns.
    this.perspective = "white";  // The perspective of the board is from White's perspective.
    this.moveHistory = [];  // The move history is an array of moves.
    this.lastMoveResult = { ok: true, message: "White to move." };  // The last move result is an object with ok and message properties.
  }

  makeMove(fromSquareName, toSquareName) {
    // We validate the move if its legal move or not
    const validation = this.validateMove(fromSquareName, toSquareName);
    this.lastMoveResult = validation;

    // If the move is not valid, we return the validation result and stop the function.
    if (!validation.ok) return validation;

    // We get the moving piece and the captured piece.
    const movingPiece = this.board.getSquareByName(fromSquareName).piece;
    const capturedPiece = this.board.getSquareByName(toSquareName).piece;

    // We move the piece to the new square.
    this.board.movePiece(fromSquareName, toSquareName);
    // We add the move to the move history.
    this.moveHistory.push({
      from: fromSquareName,
      to: toSquareName,
      piece: movingPiece, // The piece that is moving.
      capturedPiece, // The piece that is being captured.
      color: this.sideToMove, // The color of the player whose turn it is.
    });
    // We switch the turn to the opponent.
    this.sideToMove = this.getOpponentColor(this.sideToMove);
    // We update the last move result.
    this.lastMoveResult = { ok: true, message: `${this.capitalize(this.sideToMove)} to move.` };

    // We return the last move result.
    return this.lastMoveResult;
  }

  validateMove(fromSquareName, toSquareName) {

    if (!fromSquareName || !toSquareName || fromSquareName === toSquareName) {
      // This rejects invalid moves:
      // makeMove( "e2", "e2" ) // This is not a valid move.
      // makeMove( null, "e4" ) // Null is not a valid square name.
      // makeMove( "e2", null ) // Null is not a valid square name.
      return { ok: false, reason: "invalid_move", message: "A turn must move one piece to a different square." };
    } // Rule 1: You must move to a different square

    let fromSquare;
    let toSquare;

    try {
      fromSquare = this.board.getSquareByName(fromSquareName);
      toSquare = this.board.getSquareByName(toSquareName);
    } catch (error) {
      return { ok: false, reason: "invalid_square", message: error.message };
    } // Rule 2: Source and destination must be real squares


    if (!fromSquare.piece) {  
      // If fromSquare.piece is null; That means: This square is empty.
      // In JavaScript null is treated as falsy. So !null becomes true
      return { ok: false, reason: "empty_source", message: "Select a square that has a piece." };
    } // Rule 3: The source square must contain a piece

    if (fromSquare.piece.color !== this.sideToMove) {
      // If the selected piece's color is not equal to the color of the current player whose turn to move it is; 
      // That means: This piece is not the same color as the current player.
      return {
        ok: false,
        reason: "wrong_turn",
        message: `It is ${this.sideToMove}'s turn.`,
      };
    }// Rule 4: The piece must belong to the player whose turn it is

    if (toSquare.piece && toSquare.piece.color === this.sideToMove) {
      return {
        ok: false,
        reason: "friendly_destination",
        message: "You cannot move onto a square occupied by your own piece.",
      };
    } // Rule 5: You cannot move onto your own piece


    if (!this.pieceFollowsMovementRules(fromSquare, toSquare)) {
      return {
        ok: false,
        reason: "invalid_piece_movement",
        message: `${this.capitalize(fromSquare.piece.type)} cannot move that way.`,
      };
    } // Rule 6: The piece must move according to its movement rules

    return { ok: true, message: "Move is legal for the current turn rules." };
  }

  getLegalDestinations(fromSquareName) {
    const destinations = [];

    for (const square of this.board.squares.values()) {
      if (this.validateMove(fromSquareName, square.name).ok) {
        destinations.push(square.name);
      }
    }

    return destinations;
  }

  pieceFollowsMovementRules(fromSquare, toSquare) {
    const piece = fromSquare.piece;
    const fileDelta = FILES.indexOf(toSquare.file) - FILES.indexOf(fromSquare.file);
    const rankDelta = toSquare.rank - fromSquare.rank;
    const absFileDelta = Math.abs(fileDelta);
    const absRankDelta = Math.abs(rankDelta);

    switch (piece.type) {
      case "king":
        //  The king can move in all 8 directions, but only one square at a time.
        //
        // So the 8 possible directions are:
        // (-1, +1)  (0, +1)  (+1, +1)
        // (-1,  0)     K     (+1,  0)
        // (-1, -1)  (0, -1)  (+1, -1)
        // 
        // up
        // down
        // left
        // right
        // up-left
        // up-right
        // down-left
        // down-right
        // 
        // but only one square at a time.
        return absFileDelta <= 1 && absRankDelta <= 1;
      case "queen":
        // So the queen can move in all directions, and any number of squares.
        // up
        // down
        // left
        // right
        // up-left
        // up-right
        // down-left
        // down-right
        // 
        // and any number of squares.
        return this.isStraightLineMove(fileDelta, rankDelta) && this.board.hasClearPath(fromSquare, toSquare);
      case "rook":
        // The rook can move in all orthogonal directions, and any number of squares.
        // up
        // down
        // left
        // right
        // and any number of squares.
        return this.isOrthogonalMove(fileDelta, rankDelta) && this.board.hasClearPath(fromSquare, toSquare);
      case "bishop":
        // The bishop can move in all diagonal directions, and any number of squares.
        // up-left
        // up-right
        // down-left
        // down-right
        // and any number of squares.s
        return this.isDiagonalMove(fileDelta, rankDelta) && this.board.hasClearPath(fromSquare, toSquare);
      case "knight":
        // The knight can move in an L shape
        // 8  . . . . . . . .
        // 7  . . . . . . . .
        // 6  . . K . K . . .
        // 5  . K . . . K . .
        // 4  . . . N . . . .
        // 3  . K . . . K . .
        // 2  . . K . K . . .
        // 1  . . . . . . . .
        //    a b c d e f g h
        return (absFileDelta === 2 && absRankDelta === 1) || (absFileDelta === 1 && absRankDelta === 2);
      case "pawn":
        // The pawn can move forward one square, or forward two squares from its starting rank.
        // A pawn moves straight forward into empty squares, 
        // can move two squares only from its starting rank, 
        // and captures one square diagonally forward.
        return this.isValidPawnMove(fromSquare, toSquare, fileDelta, rankDelta);
      default:
        return false;
    }
  }

  isValidPawnMove(fromSquare, toSquare, fileDelta, rankDelta) {
    // The direction is the direction of the pawn's movement.
    const direction = fromSquare.piece.color === "white" ? 1 : -1;
    // The starting rank is the rank of the pawn's starting position.
    const startingRank = fromSquare.piece.color === "white" ? WHITE_PAWN_RANK : BLACK_PAWN_RANK;
    // The isSingleForward is a boolean that is true if the pawn is moving one square forward.
    const isSingleForward = fileDelta === 0 && rankDelta === direction && !toSquare.isOccupied();
    // The isDoubleForward is a boolean that is true if the pawn is moving two squares forward.
    const isDoubleForward =
      fileDelta === 0 &&
      rankDelta === direction * 2 &&
      fromSquare.rank === startingRank &&
      !toSquare.isOccupied() &&
      !this.board.getSquare(fromSquare.file, fromSquare.rank + direction).isOccupied();
    // The isDiagonalCapture is a boolean that is true if the pawn is capturing a piece diagonally forward.
    const isDiagonalCapture =
      Math.abs(fileDelta) === 1 &&
      rankDelta === direction &&
      toSquare.isOccupied() &&
      toSquare.piece.color !== fromSquare.piece.color;
    // The isValidPawnMove is a boolean that is true if the pawn is moving one square forward, two squares forward, or capturing a piece diagonally forward.
    return isSingleForward || isDoubleForward || isDiagonalCapture;
  }

  isStraightLineMove(fileDelta, rankDelta) {
    return this.isOrthogonalMove(fileDelta, rankDelta) || this.isDiagonalMove(fileDelta, rankDelta);
  }

  isOrthogonalMove(fileDelta, rankDelta) {
    return (fileDelta === 0 && rankDelta !== 0) || (rankDelta === 0 && fileDelta !== 0);
  }

  isDiagonalMove(fileDelta, rankDelta) {
    return Math.abs(fileDelta) === Math.abs(rankDelta) && fileDelta !== 0;
  }

  getOpponentColor(color) {
    return color === "white" ? "black" : "white";
  }

  capitalize(value) {
    return value[0].toUpperCase() + value.slice(1);
  }
}
