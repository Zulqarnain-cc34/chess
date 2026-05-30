const game = new ChessGame();
const squareSize = 64;
const boardPadding = 32;
const boardPixelSize = squareSize * BOARD_SIZE;

function setup() {
  createCanvas(boardPixelSize + boardPadding * 2, boardPixelSize + boardPadding * 2);
  textAlign(CENTER, CENTER);
  textFont("serif");
}

function draw() {
  background(245);
  drawBoard(game.board, game.perspective);
  drawLabels(game.perspective);
}

function drawBoard(board, perspective) {
  const displaySquares = board.getDisplaySquares(perspective);

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const square = displaySquares[row][col];
      const x = boardPadding + col * squareSize;
      const y = boardPadding + row * squareSize;

      noStroke();
      fill(square.color === "dark" ? "#769656" : "#eeeed2");
      rect(x, y, squareSize, squareSize);

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