const game = new ChessGame();
const squareSize = 64;
const boardPadding = 32;
const boardPixelSize = squareSize * BOARD_SIZE;
let selectedSquareName = null;
let highlightedSquares = [];

function setup() {
  createCanvas(boardPixelSize + boardPadding * 2, boardPixelSize + boardPadding * 2 + 48);
  textAlign(CENTER, CENTER);
  textFont("serif");
}

function draw() {
  background(245);
  drawBoard(game.board, game.perspective, selectedSquareName, highlightedSquares);
  drawLabels(game.perspective);
  drawStatus();
}

function drawBoard(board, perspective, selectedName, legalDestinations) {
  const displaySquares = board.getDisplaySquares(perspective);

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const square = displaySquares[row][col];
      const x = boardPadding + col * squareSize;
      const y = boardPadding + row * squareSize;

      noStroke();
      fill(square.color === "dark" ? "#769656" : "#eeeed2");
      rect(x, y, squareSize, squareSize);

      if (square.name === selectedName) {
        noFill();
        stroke("#f6d365");
        strokeWeight(4);
        rect(x + 2, y + 2, squareSize - 4, squareSize - 4);
        noStroke();
      }

      if (legalDestinations.includes(square.name)) {
        drawMoveHighlight(square, x, y);
      }

      if (square.piece) {
        drawPiece(square.piece, x + squareSize / 2, y + squareSize / 2 + 2);
      }
    }
  }
}

function drawPiece(piece, x, y) {
  textSize(42);

  if (piece.color === "white") {
    stroke("#2f2f2f");
    strokeWeight(3);
    fill("#fff8dc");
  } else {
    stroke("#f2f2f2");
    strokeWeight(1);
    fill("#141414");
  }

  text(piece.symbol, x, y);
  noStroke();
}

function drawMoveHighlight(square, x, y) {
  noStroke();

  if (square.isOccupied()) {
    noFill();
    stroke("#f6d365");
    strokeWeight(4);
    circle(x + squareSize / 2, y + squareSize / 2, squareSize * 0.82);
    noStroke();
  } else {
    fill(30, 30, 30, 90);
    circle(x + squareSize / 2, y + squareSize / 2, squareSize * 0.26);
  }
}

function drawLabels(perspective) {
  const displayFiles = perspective === "white" ? FILES : [...FILES].reverse();
  const displayRanks = perspective === "white" ? [...RANKS].reverse() : RANKS;

  fill(30);
  textSize(14);
  textFont("monospace");

  for (let i = 0; i < BOARD_SIZE; i += 1) {
    const fileX = boardPadding + i * squareSize + squareSize / 2;
    const rankY = boardPadding + i * squareSize + squareSize / 2;

    text(displayFiles[i].toUpperCase(), fileX, boardPadding + boardPixelSize + 16);
    text(displayRanks[i], boardPadding - 16, rankY);
  }

  textFont("serif");
}

function drawStatus() {
  fill(35);
  noStroke();
  textSize(16);
  textFont("sans-serif");
  text(game.lastMoveResult.message, width / 2, boardPadding + boardPixelSize + 40);
  textFont("serif");
}

function mousePressed() {
  const clickedSquare = getSquareAtMouse();

  if (!clickedSquare) {
    selectedSquareName = null;
    highlightedSquares = [];
    return;
  }

  if (!selectedSquareName) {
    selectSquare(clickedSquare);
    return;
  }

  const result = game.makeMove(selectedSquareName, clickedSquare.name);
  selectedSquareName = null;
  highlightedSquares = [];

  if (!result.ok && clickedSquare.piece?.color === game.sideToMove) {
    selectSquare(clickedSquare);
  }
}

function selectSquare(square) {
  if (!square.piece) {
    game.lastMoveResult = { ok: false, message: "Select a piece to move." };
    return;
  }

  if (square.piece.color !== game.sideToMove) {
    game.lastMoveResult = { ok: false, message: `It is ${game.sideToMove}'s turn.` };
    return;
  }

  selectedSquareName = square.name;
  highlightedSquares = game.getLegalDestinations(square.name);
  game.lastMoveResult = {
    ok: true,
    message: `Selected ${square.piece.color} ${square.piece.type} on ${square.name}. ${highlightedSquares.length} move(s) available.`,
  };
}

function getSquareAtMouse() {
  const col = Math.floor((mouseX - boardPadding) / squareSize);
  const row = Math.floor((mouseY - boardPadding) / squareSize);

  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) {
    return null;
  }

  return game.board.getDisplaySquares(game.perspective)[row][col];
}