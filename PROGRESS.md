# Chess Game Progress

This document tracks what has been implemented, what remains, and the recommended path to finish the chess project.

## Current Status

The project has a working p5.js chess board foundation. Pieces can be rendered, selected, highlighted, moved, captured, validated against movement rules, filtered for king safety, ended by checkmate, stalemate, or draw rules, and pawns can promote automatically.

Estimated completion:

- Basic playable board: about 85%.
- Complete legal chess game: about 75%.

## Completed

### Documentation

- Created `CHESS_RULES.md`.
- Documented board setup, piece movement, turns, captures, special moves, check/checkmate, draw rules, and implementation notes.

### Board Model

- Implemented `ChessGame`.
- Implemented `ChessBoard`.
- Implemented `ChessSquare`.
- Implemented `ChessPiece`.
- Board size is fixed at 8 by 8.
- Files are `a` through `h`.
- Ranks are `1` through `8`.
- `a1` is dark.
- White perspective is supported.

### Starting Position

- White pieces start on ranks `1` and `2`.
- Black pieces start on ranks `8` and `7`.
- Back-rank pieces are placed correctly.
- Pawns are placed correctly.
- Piece counts can be calculated.

### Turn System

- White moves first.
- Players alternate turns after a legal move.
- Same-square moves are rejected.
- Empty-source moves are rejected.
- Wrong-turn moves are rejected.
- Moves onto friendly pieces are rejected.

### Basic Movement Rules

- King movement shape is implemented.
- Queen movement shape is implemented.
- Rook movement shape is implemented.
- Bishop movement shape is implemented.
- Knight movement shape is implemented.
- Pawn single move, double move from starting rank, and diagonal capture are implemented.

### Path Checking

- Sliding pieces cannot jump over other pieces.
- `hasClearPath()` checks middle squares between source and destination.
- `getClearPathTrace()` and `printClearPathDebug()` help explain path checking step by step.

### Captures

- Capturing an enemy piece by moving onto its square works.
- Captured pieces are recorded in move history.
- Friendly pieces cannot be captured.

### UI

- p5.js renders the board.
- Pieces are visible on the board.
- White pieces have better contrast.
- Clicking a piece selects it.
- Legal destination squares are highlighted.
- Empty destinations use a dot highlight.
- Capture destinations use a ring highlight.
- Status text shows current selection and current turn.

### King Safety

- `findKing(color)` locates a side's king.
- `isSquareAttacked(squareName, byColor)` detects whether a square is attacked.
- `isKingInCheck(color)` detects whether a side's king is currently attacked.
- `wouldLeaveKingInCheck(fromSquareName, toSquareName)` simulates a move and rejects unsafe moves.
- Kings cannot be captured.
- Kings cannot move into attacked squares.
- Pinned pieces cannot move away if that exposes their own king.
- Move highlights now exclude moves that leave the king in check.

### Checkmate

- `getLegalMoves(color)` generates all legal moves for a side.
- `isCheckmate(color)` detects when a checked side has no legal moves.
- `updateGameStatus()` now supports `active`, `check`, `checkmate`, and `stalemate`.
- Moves after checkmate are rejected.
- Checkmate status message names the winning side.

### Stalemate

- `isStalemate(color)` detects when a side is not in check but has no legal moves.
- Stalemate ends the game as a draw.
- Moves after stalemate are rejected.

### Promotion

- Pawns automatically promote to queens on the final rank.
- White pawns promote on rank `8`.
- Black pawns promote on rank `1`.
- Promotion is recorded in move history.

### Draw Rules

- Insufficient material detection is implemented.
- Fifty-move rule detection is implemented with a halfmove clock.
- The halfmove clock resets after pawn moves and captures.
- Threefold repetition detection is implemented with position history.
- Draw status messages are displayed in the UI.
- Moves after draw states are rejected.

## Not Yet Implemented

### Special Moves

- Castling.
- En passant.

### Draw Rules

- Mutual draw agreement UI.

### Game State Improvements

- Track en passant target square.
- Track castling rights.
- Track fullmove number.

### Testing

- Add repeatable test helpers or a small test file.
- Test every piece movement rule.
- Test illegal moves.
- Test check/checkmate/stalemate/draw states.
- Test special moves once implemented.

## Recommended Next Steps

### Phase 1: En Passant

Track the en passant target square after a two-square pawn move and allow the capture only on the immediately following move.

### Phase 2: Castling

Track castling rights and implement:

- Kingside castling.
- Queenside castling.
- Castling restrictions through check.

## Done / In Progress / Remaining

| Area | Status |
| --- | --- |
| Rules document | Done |
| Board rendering | Done |
| Starting position | Done |
| Turn alternation | Done |
| Basic movement validation | Done |
| Capture handling | Done |
| Move highlighting | Done |
| King safety | Done |
| Check detection | Done |
| Checkmate | Done |
| Stalemate | Done |
| Promotion | Done |
| Castling | Remaining |
| En passant | Remaining |
| Draw rules | Done |
| Full test coverage | Remaining |

## Definition of Done

The chess game is complete when:

- Every legal chess move is accepted.
- Every illegal chess move is rejected.
- The game detects check.
- The game detects checkmate.
- The game detects stalemate.
- Promotion works.
- Castling works.
- En passant works.
- Draw rules are supported.
- The UI prevents moves after game over.
- Move highlights match actual legal moves.
- Core rules have repeatable tests.

