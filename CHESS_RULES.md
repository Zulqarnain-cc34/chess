# Chess Rules Specification

This document defines the rules of standard chess for a future p5.js chess game. It is written as an implementation reference: every rule should eventually map to validation, move generation, UI state, or game-state logic.

## 1. Game Objective

Chess is a two-player strategy game played between White and Black. The objective is to checkmate the opponent's king.

A player is checkmated when:

- Their king is under attack.
- They have no legal move that removes the attack.

The king is never captured in legal chess. The game ends immediately when checkmate is reached.

## 2. Board

Chess is played on an 8 by 8 board with 64 squares.

- Files are the vertical columns: `a` through `h`.
- Ranks are the horizontal rows: `1` through `8`.
- White's back rank is rank `1`.
- Black's back rank is rank `8`.
- Square `a1` is dark.
- White pieces start on ranks `1` and `2`.
- Black pieces start on ranks `8` and `7`.

When displayed from White's perspective:

- White pieces are at the bottom.
- Black pieces are at the top.
- Files increase left to right from `a` to `h`.
- Ranks increase bottom to top from `1` to `8`.

## 3. Starting Position

### 3.1 White Pieces

| Piece | Starting squares |
| --- | --- |
| King | `e1` |
| Queen | `d1` |
| Rooks | `a1`, `h1` |
| Bishops | `c1`, `f1` |
| Knights | `b1`, `g1` |
| Pawns | `a2`, `b2`, `c2`, `d2`, `e2`, `f2`, `g2`, `h2` |

### 3.2 Black Pieces

| Piece | Starting squares |
| --- | --- |
| King | `e8` |
| Queen | `d8` |
| Rooks | `a8`, `h8` |
| Bishops | `c8`, `f8` |
| Knights | `b8`, `g8` |
| Pawns | `a7`, `b7`, `c7`, `d7`, `e7`, `f7`, `g7`, `h7` |

### 3.3 Piece Counts

Each side starts with:

- 1 king
- 1 queen
- 2 rooks
- 2 bishops
- 2 knights
- 8 pawns

Total pieces at the start: 32.

## 4. Turns

White always moves first. Players then alternate turns.

On a turn, a player must make exactly one legal move. A player may not pass.

A move is legal only if:

- The piece belongs to the player whose turn it is.
- The piece follows its movement rules.
- The destination square is either empty or occupied by an opponent's piece.
- The path is clear for sliding pieces.
- The move does not leave the moving player's king in check.
- The move satisfies any special rule conditions, if applicable.

## 5. Captures

A capture occurs when a piece moves to a square occupied by an opponent's piece.

- The captured piece is removed from the board.
- A piece may never capture a friendly piece.
- The king may not be captured. Instead, attacks against the king create check, checkmate, or illegal move states.

Pawns are the only pieces whose capturing movement is different from their non-capturing movement.

## 6. Piece Movement

### 6.1 King

The king moves one square in any direction:

- Horizontally
- Vertically
- Diagonally

The king may not move to a square attacked by an opponent's piece.

The king may not remain in check after any legal move.

The king also has one special move: castling.

### 6.2 Queen

The queen moves any number of empty squares in a straight line:

- Horizontally
- Vertically
- Diagonally

The queen may not jump over pieces.

### 6.3 Rook

The rook moves any number of empty squares:

- Horizontally
- Vertically

The rook may not jump over pieces.

The rook participates in castling if it and the king satisfy the castling conditions.

### 6.4 Bishop

The bishop moves any number of empty squares diagonally.

The bishop may not jump over pieces.

A bishop always remains on the same color of square throughout the game.

### 6.5 Knight

The knight moves in an L shape:

- Two squares in one straight direction and one square perpendicular to that direction.

Examples from a central square:

- Two up, one left
- Two up, one right
- Two down, one left
- Two down, one right
- Two left, one up
- Two left, one down
- Two right, one up
- Two right, one down

The knight may jump over pieces.

### 6.6 Pawn

Pawns move differently depending on whether they are moving or capturing.

#### White Pawns

White pawns move toward increasing ranks:

- From rank `2` toward rank `8`.

#### Black Pawns

Black pawns move toward decreasing ranks:

- From rank `7` toward rank `1`.

#### Pawn Forward Movement

A pawn may move forward one square if the square is empty.

A pawn may move forward two squares only if:

- The pawn is on its starting rank.
- Both the first square and second square in front of it are empty.

Starting ranks:

- White pawns: rank `2`
- Black pawns: rank `7`

#### Pawn Captures

A pawn captures one square diagonally forward.

- White captures one rank upward and one file left or right.
- Black captures one rank downward and one file left or right.

A pawn may not capture by moving straight forward.

#### Pawn Promotion

When a pawn reaches the final rank, it must promote immediately.

- White promotes on rank `8`.
- Black promotes on rank `1`.

The pawn is replaced by one of the following pieces of the same color:

- Queen
- Rook
- Bishop
- Knight

Promotion is not limited to captured pieces. A player may have multiple queens or more than two rooks, bishops, or knights after promotion.

In most implementations, promotion choice should be requested before the move is finalized.

#### En Passant

En passant is a special pawn capture.

It is available only when:

- A pawn moves forward two squares from its starting rank.
- It lands beside an opposing pawn.
- The opposing pawn could have captured it if it had moved only one square.
- The opposing player performs the en passant capture immediately on the next move.

If the opposing player makes any other move first, the en passant right expires.

When en passant is performed:

- The capturing pawn moves diagonally to the square the moved pawn passed over.
- The pawn that moved two squares is removed from the board.

Example:

- White pawn on `e5`.
- Black pawn moves from `d7` to `d5`.
- White may capture en passant by moving from `e5` to `d6`.
- The black pawn on `d5` is removed.

## 7. Castling

Castling is a special king move involving the king and one rook.

There are two types:

- Kingside castling
- Queenside castling

### 7.1 Kingside Castling

White kingside castling:

- King moves from `e1` to `g1`.
- Rook moves from `h1` to `f1`.

Black kingside castling:

- King moves from `e8` to `g8`.
- Rook moves from `h8` to `f8`.

### 7.2 Queenside Castling

White queenside castling:

- King moves from `e1` to `c1`.
- Rook moves from `a1` to `d1`.

Black queenside castling:

- King moves from `e8` to `c8`.
- Rook moves from `a8` to `d8`.

### 7.3 Castling Conditions

Castling is legal only if all conditions are true:

- The king has not moved before.
- The rook involved in castling has not moved before.
- All squares between the king and rook are empty.
- The king is not currently in check.
- The square the king passes through is not attacked by an opponent's piece.
- The destination square of the king is not attacked by an opponent's piece.

Important details:

- The rook may pass through or land on squares attacked by enemy pieces; only the king's current, passing, and destination squares matter.
- Castling is not allowed if the king would castle out of, through, or into check.
- Castling rights are lost permanently once the king moves.
- Castling rights for a rook are lost permanently once that rook moves, even if it later returns to its starting square.

## 8. Check

A king is in check when at least one opponent piece attacks the king's square.

When a player is in check, their next move must remove the check.

A check may be answered by:

- Moving the king to a safe square.
- Capturing the attacking piece.
- Blocking the attack with another piece, if the attacking piece is a sliding piece.

Checks from knights and adjacent pieces cannot be blocked; they must be resolved by moving the king, capturing the attacker, or another legal move that removes the attack.

A player may not make a move that leaves their own king in check.

A player may not make a move that puts their own king in check.

## 9. Checkmate

Checkmate occurs when:

- The current player's king is in check.
- The current player has no legal move that removes the check.

When checkmate occurs:

- The game ends immediately.
- The player delivering checkmate wins.
- No king capture is performed.

## 10. Stalemate

Stalemate occurs when:

- The current player's king is not in check.
- The current player has no legal move.

Stalemate is a draw.

## 11. Draw Rules

### 11.1 Mutual Agreement

Players may agree to a draw.

For a program, this may be represented as a UI action rather than automatic rule detection.

### 11.2 Stalemate

The game is drawn by stalemate when the conditions in Section 10 are met.

### 11.3 Insufficient Material

The game is drawn when neither side has enough material to checkmate by any legal sequence.

Common automatic insufficient material cases:

- King versus king.
- King and bishop versus king.
- King and knight versus king.
- King and bishop versus king and bishop, when both bishops are on the same color squares.

Cases such as king and two knights versus king are usually not automatic insufficient material in strict rules because checkmate can occur with help from the opponent, although it cannot be forced.

For a first implementation, support only the common automatic cases above. More complex dead-position detection can be added later if needed.

### 11.4 Fifty-Move Rule

A player may claim a draw if 50 moves by each player have occurred without:

- Any pawn move.
- Any capture.

In implementation terms, this is tracked as a halfmove clock:

- Increment the halfmove clock after each move.
- Reset it to `0` after any pawn move or capture.
- A claim is available after 100 halfmoves.

Some rule sets include an automatic draw after 75 moves by each player without a pawn move or capture. Decide whether to support only the common 50-move claim or also official automatic 75-move handling.

For a first implementation, it is acceptable to mark this state as claimable instead of automatically ending the game.

### 11.5 Threefold Repetition

A player may claim a draw if the same position occurs three times.

Positions are considered the same when:

- The same pieces occupy the same squares.
- The same player has the move.
- The same castling rights exist.
- The same en passant rights exist.

The repeated positions do not need to occur consecutively.

Some rule sets include an automatic draw after fivefold repetition. Decide whether to support only the common threefold claim or also official automatic fivefold handling.

For repetition tracking, store a compact position key after each move. The key should include board placement, side to move, castling rights, and en passant target.

## 12. Illegal Moves

The following are illegal:

- Moving a piece that does not belong to the player whose turn it is.
- Moving to a square occupied by a friendly piece.
- Moving a piece in a way that violates its movement pattern.
- Moving a sliding piece through another piece.
- Moving a pawn forward into an occupied square.
- Moving a pawn diagonally without a capture, except for valid en passant.
- Moving a pawn two squares when blocked or not on its starting rank.
- Moving into check.
- Leaving the king in check.
- Castling while in check.
- Castling through check.
- Castling into check.
- Castling after the king or relevant rook has moved.
- Capturing the king.
- Making a move after the game has ended.

## 13. Game State

A chess implementation should track at least:

- Board position.
- Side to move.
- Castling rights for both sides.
- En passant target square, if any.
- Halfmove clock for the fifty-move rule.
- Fullmove number.
- Captured pieces, if useful for UI.
- Move history.
- Repetition history.
- Current game result.

The fullmove number starts at `1` and increments after Black completes a move.

### 13.1 Recommended Result States

Use explicit game states rather than relying only on UI text.

| State | Meaning |
| --- | --- |
| `active` | Game is ongoing and current player is not in check. |
| `check` | Game is ongoing and current player is in check. |
| `checkmate` | Game ended by checkmate. |
| `stalemate` | Game ended by stalemate. |
| `draw_insufficient_material` | Game ended by insufficient material. |
| `draw_fifty_move` | Game ended or claimable by fifty-move rule. |
| `draw_repetition` | Game ended or claimable by repetition. |
| `draw_agreement` | Game ended by mutual agreement. |
| `resignation` | Game ended by resignation. |

## 14. Implementation Checklist for p5.js

This section lists rule-level logic that should eventually become code.

### 14.1 Board and Coordinates

- Represent the board as 64 squares.
- Convert between screen coordinates and board coordinates.
- Convert between board coordinates and algebraic notation, such as `e4`.
- Validate that a square is inside the board.
- Determine square color for rendering and bishop-color logic.

Suggested helpers:

- `isInsideBoard(file, rank)`
- `squareToCoords(square)`
- `coordsToSquare(file, rank)`
- `getSquareColor(square)`

### 14.2 Piece Movement

Generate pseudo-legal moves for each piece before filtering for king safety.

Suggested helpers:

- `getPseudoLegalMoves(piece, square, gameState)`
- `getKingMoves(square, gameState)`
- `getQueenMoves(square, gameState)`
- `getRookMoves(square, gameState)`
- `getBishopMoves(square, gameState)`
- `getKnightMoves(square, gameState)`
- `getPawnMoves(square, gameState)`
- `getSlidingMoves(square, directions, gameState)`

### 14.3 Legal Move Validation

A legal move is a pseudo-legal move that does not leave the moving side's king in check.

Suggested helpers:

- `isLegalMove(move, gameState)`
- `makeMove(move, gameState)`
- `undoMove(move, gameState)`
- `getLegalMoves(color, gameState)`
- `wouldLeaveKingInCheck(move, gameState)`

### 14.4 Attack Detection

Attack detection should answer whether a square is controlled by the opponent.

Suggested helpers:

- `isSquareAttacked(square, byColor, gameState)`
- `isKingInCheck(color, gameState)`
- `findKing(color, gameState)`

Important implementation detail:

- Pawn attacks are diagonal even when no piece is present on the attacked square.
- King attacks adjacent squares, but kings may never be adjacent in a legal position.
- Attack detection should be separate from normal legal move generation to avoid circular logic.

### 14.5 Special Moves

Suggested helpers:

- `canCastle(color, side, gameState)`
- `getCastlingMoves(color, gameState)`
- `canEnPassant(pawnSquare, targetSquare, gameState)`
- `getEnPassantMoves(pawnSquare, gameState)`
- `promotePawn(move, promotionPiece, gameState)`

Track:

- Whether each king has moved.
- Whether each original rook has moved.
- Current castling rights.
- En passant target square after a two-square pawn move.
- Promotion selection when a pawn reaches the final rank.

### 14.6 End Conditions

Suggested helpers:

- `updateGameStatus(gameState)`
- `isCheckmate(color, gameState)`
- `isStalemate(color, gameState)`
- `hasInsufficientMaterial(gameState)`
- `canClaimFiftyMoveDraw(gameState)`
- `canClaimThreefoldRepetition(gameState)`
- `recordPositionForRepetition(gameState)`

Recommended order after every move:

1. Apply move.
2. Handle capture removal, including en passant capture removal.
3. Handle promotion replacement if a pawn reached the final rank.
4. Update castling rights.
5. Update en passant target.
6. Update halfmove clock.
7. Update fullmove number after Black moves.
8. Switch side to move.
9. Record position for repetition.
10. Generate legal moves for the new side to move.
11. Determine check, checkmate, stalemate, or draw state.

## 15. Suggested Data Model

This is not final code, but it describes the state shape the chess project will likely need.

```js
const gameState = {
  board: {
    e1: { type: "king", color: "white" },
    e8: { type: "king", color: "black" },
  },
  sideToMove: "white",
  castlingRights: {
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true },
  },
  enPassantTarget: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
  moveHistory: [],
  positionHistory: [],
  status: "active",
};
```

## 16. Minimum Viable Rule Scope

For a first playable version, implement in this order:

1. Board rendering and initial position.
2. Basic piece movement without check validation.
3. Turn handling and captures.
4. King safety and legal move filtering.
5. Check, checkmate, and stalemate.
6. Pawn promotion.
7. Castling.
8. En passant.
9. Draw rules and repetition tracking.

Do not start with every rule at once. Build the game in layers and test each rule group before adding the next.

