import { useState, useEffect } from 'react';
import './App.css';
import { Game } from './game';

function App() {
	const [game, setGame] = useState();
	useEffect(() => {
		const newGame = new Game();
		newGame.start();
		setGame(newGame);
		return () => {};
	}, []);

	const updateDisplay = newGame => {
		let gameCopy = new Game();
		gameCopy.board = newGame.board;
		gameCopy.chosenPiece = newGame.chosenPiece;
		gameCopy.currentTurn = newGame.currentTurn;
		setGame(gameCopy);
	};

	const cellClicked = cell => {
		game.handleClick(cell, updateDisplay);
	};

	return (
		<div className="App">
			<table className="board">
				<tbody>
					{game &&
						game.board &&
						game.board.getBoard().map((row, rowIndex) => {
							return (
								<tr key={rowIndex}>
									{row.map((cell, cellIndex) => {
										return (
											<td
												key={cellIndex}
												className={`cell ${cell.isBlack ? 'blackCell' : 'whiteCell'} ${
													cell.isClickable ? 'click' : ''
												}`}
												onClick={cell.isClickable ? () => cellClicked(cell) : undefined}
											>
												{cell.content.img && <img src={cell.content.img} alt="piece" className="pieceImg" />}
												{cell.isDotted && <span className="dot"></span>}
											</td>
										);
									})}
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}

export default App;
