import { Board, Cell, Pawn, Piece, Team } from './board';

export class Game {
	public currentTurn: Team;
	public board: Board;
	public chosenPiece: Cell | null;
	constructor() {
		this.currentTurn = Team.white;
		this.board = new Board();
		this.chosenPiece = null;
	}

	start() {
		this.markPlayersClickable(Team.white);
	}

	markPlayersClickable(team: Team) {
		const board = this.board.getBoard();
		board.forEach(row => {
			row.forEach(cell => {
				cell.isClickable = (cell.content as Piece).team == team;
			});
		});
	}

	handleClick(cell: Cell, updateCallback: CallableFunction) {
		this.clearDots();
		if (cell.content instanceof Piece) {
			this.chosenPiece = cell;
			this.handlePieceClicked(cell);
		} else {
			if (this.chosenPiece) {
				this.movePiece(this.chosenPiece, cell);
				this.switchTurn();
			}
		}
		updateCallback(this);
	}

	clearDots() {
		this.board.getBoard().forEach(row => {
			row.forEach(cell => {
				cell.isDotted = false;
				if (!this.isContainsTeamPlayer(cell)) {
					cell.isClickable = false;
				}
			});
		});
	}

	isContainsTeamPlayer(cell: Cell) {
		return cell.content instanceof Piece && (cell.content as Piece).team == this.currentTurn;
	}

	handlePieceClicked(cell: Cell) {
		(cell.content as Piece).walkingFunc(this.board, cell.row, cell.col);
		if (cell.content instanceof Pawn) (cell.content as Pawn).eatingFunc(this.board, cell.row, cell.col);
	}

	movePiece(origin: Cell, dest: Cell) {
		dest.content = origin.content;
		(dest.content as Piece).hasMoved = true;
		origin.content = 0;
	}

	switchTurn() {
		this.chosenPiece = null;
		this.currentTurn = this.board.getOppositeTeam(this.currentTurn);
		this.markPlayersClickable(this.currentTurn);
	}
}
