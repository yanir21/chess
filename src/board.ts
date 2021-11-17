import { beginString } from './notations';

export enum Team {
	white = 0,
	black = 1
}

export class Board {
	private content: Cell[][];
	constructor() {
		this.content = Array(8);
		for (let i = 0; i < 8; i++) {
			this.content[i] = Array(8);
			for (let j = 0; j < 8; j++) {
				this.content[i][j] = new Cell(0, false, this.isCellBlack(i, j), i, j);
			}
		}
		this.stringToBoard(beginString);
	}

	getBoard = () => {
		return this.content;
	};

	isCellBlack(row: number, col: number) {
		return row % 2 === 0 ? col % 2 !== 0 : col % 2 === 0;
	}

	getOppositeTeam(team: Team) {
		return team == Team.white ? Team.black : Team.white;
	}

	isCellValid(row: number, col: number, isEating: boolean, currentTeam: Team) {
		if (row > 7 || row < 0 || col > 7 || col < 0) return false;
		const currentCell: Cell = this.content[row][col];
		return !(currentCell.content instanceof Piece) || (isEating && (currentCell.content as Piece).team != currentTeam);
	}

	stringToBoard = (notation: string) => {
		const tokens: string[] = notation.split(' ');
		tokens.forEach(token => {
			const row = token[0].charCodeAt(0) - 65;
			const col = parseInt(token[1]) - 1;
			const piece = token[2];
			const team = token[3] === 'w' ? Team.white : Team.black;

			let pieceInstance: Piece | 0 = 0;
			switch (piece) {
				case 'p':
					pieceInstance = new Pawn(team);
					break;
				case 'b':
					pieceInstance = new Bishop(team);
					break;
				case 'n':
					pieceInstance = new Knight(team);
					break;
				case 'r':
					pieceInstance = new Rook(team);
					break;
				case 'q':
					pieceInstance = new Queen(team);
					break;
				case 'k':
					pieceInstance = new King(team);
					break;

				default:
					break;
			}
			this.content[row][col].content = pieceInstance;
		});
	};
}

export class Cell {
	content: Piece | 0;
	isDotted: boolean;
	isBlack: boolean;
	isClickable: boolean = false;
	row: number;
	col: number;
	constructor(content: Piece | 0 = 0, isDotted: boolean = false, isBlack: boolean = false, row: number, col: number) {
		this.content = content;
		this.isDotted = isDotted;
		this.isBlack = isBlack;
		this.row = row;
		this.col = col;
	}

	markDotted() {
		this.isClickable = true;
		this.isDotted = true;
	}
}

export abstract class Piece {
	team: Team;
	heatMap: any;
	value: number;
	img: string;
	hasMoved: boolean = false;
	abstract walkingFunc: (board: Board, row: number, col: number) => void;
	// abstract eatingFunc: void;
	constructor(team: Team, value: number, img: string) {
		this.team = team;
		this.value = value;
		this.img = '/pieces/' + (team === Team.white ? 'w' : 'b') + img;
	}
}

export class Pawn extends Piece {
	walkingFunc = (board: Board, row: number, col: number) => {
		const rowProgress = this.team == Team.white ? -1 : 1;
		const allowedProgress = this.hasMoved ? 1 : 2;
		for (let i = 1; i <= allowedProgress && board.isCellValid(row + i * rowProgress, col, false, this.team); i++) {
			if (board) board.getBoard()[row + i * rowProgress][col].markDotted();
		}
	};

	eatingFunc = (board: Board, row: number, col: number) => {
		const rowProgress: number = this.team == Team.white ? -1 : 1;
		if (this.canEatCell(board, row + rowProgress, col + 1)) {
			board.getBoard()[row + rowProgress][col + 1].markDotted();
		}
		if (this.canEatCell(board, row + rowProgress, col - 1)) {
			board.getBoard()[row + rowProgress][col + 1].markDotted();
		}
	};

	canEatCell(board: Board, row: number, col: number): boolean {
		if (!board.isCellValid(row, col, true, this.team)) return false;
		const cell = board.getBoard()[row][col];
		return cell.content != 0 && board.getOppositeTeam(this.team) == (cell.content as Piece).team;
	}

	constructor(team: Team) {
		super(team, 1, 'p.png');
	}
}

export class Bishop extends Piece {
	walkingFunc = (board: Board, row: number, col: number) => {
		const colProgress = this.team == Team.white ? -1 : 1;
		board.getBoard()[row][col + colProgress].markDotted();
	};
	constructor(team: Team) {
		super(team, 3, 'b.png');
	}
}
export class Knight extends Piece {
	walkingFunc = (board: Board, row: number, col: number) => {
		const colProgress = this.team == Team.white ? -1 : 1;
		board.getBoard()[row][col + colProgress].markDotted();
	};
	constructor(team: Team) {
		super(team, 3, 'k.png');
	}
}
export class Rook extends Piece {
	walkingFunc = (board: Board, row: number, col: number) => {
		const colProgress = this.team == Team.white ? -1 : 1;
		board.getBoard()[row][col + colProgress].markDotted();
	};
	constructor(team: Team) {
		super(team, 5, 'r.png');
	}
}
export class Queen extends Piece {
	walkingFunc = (board: Board, row: number, col: number) => {
		const colProgress = this.team == Team.white ? -1 : 1;
		board.getBoard()[row][col + colProgress].markDotted();
	};
	constructor(team: Team) {
		super(team, 9, 'q.png');
	}
}

export class King extends Piece {
	walkingFunc = (board: Board, row: number, col: number) => {
		const colProgress = this.team == Team.white ? -1 : 1;
		board.getBoard()[row][col + colProgress].markDotted();
	};
	constructor(team: Team) {
		super(team, 200, 'ki.png');
	}
}
