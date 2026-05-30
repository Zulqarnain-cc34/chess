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

  getSquare(file, rank) {
    const square = this.squares.get(`${file}${rank}`);

    if (!square) {
      throw new Error(`Square does not exist: ${file}${rank}`);
    }

    return square;
  }

  getSquareByName(squareName) {
    const file = squareName[0];
    const rank = Number(squareName[1]);
    return this.getSquare(file, rank);
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
    this.sideToMove = "white";
    this.perspective = "white";
  }
}
