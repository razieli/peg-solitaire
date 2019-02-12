/*
 *	Peg Solitaire solver.
 *	
 *	Finds and prints a sequence of moves that ends with a one peg in the middle hole.
 *
 *	First attempted algorithm (solvePegSol(board)) uses recursion and backtracking, but has an unacceptably long run-time.
 *	Improved algorithm (solvePegSolSym(board)) works the same way but reduces the number of paths checked by exploiting the board's symmetry.
 *
 */


/*	Board with 5 moves left to 'win', for testing.

							['x','x','0','0','0','x','x'],
							['x','x','0','1','0','x','x'],
							['0','0','1','0','1','0','0'],
							['0','0','1','0','0','1','0'],
							['0','0','0','0','0','0','0'],
							['x','x','0','0','0','x','x'],
							['x','x','0','0','0','x','x']
							
*/


/* Class used to construct a board object and manipulate it. */
class PegSolBoard {
	
	/* Constructs a full game board in its starting position */
	constructor() {
		this.board = [
							['x','x','1','1','1','x','x'],
							['x','x','1','1','1','x','x'],
							['1','1','1','1','1','1','1'],
							['1','1','1','0','1','1','1'],
							['1','1','1','1','1','1','1'],
							['x','x','1','1','1','x','x'],
							['x','x','1','1','1','x','x']
					 ];
		this.pegs = 32;
		this.moveQueue = [];
	}
	
	/* Checks whether a given hole is empty */
	isEmpty(x,y) {
		if(this.board[x][y] == '0') {
			return true;
		}
		return false;
	}
	
	/* Checks whether a given coordinate is within the board's boundaries */
	isInBounds(x,y) {
		if(x > 6 || y > 6 || x < 0 || y < 0) {
			return false;
		}
		if(this.board[x][y] == 'x') {
			return false;
		}
		return true;
	}
	
	/* Checks whether a move from the coordinate in arg 1 to the coordinate in arg 2 is possible */
	isLegalMove([x,y],[z,w]) {
		if(this.isInBounds(x,y) && this.isInBounds(z,w)) {
			if(!this.isEmpty(x,y) && this.isEmpty(z,w)) {
				if(x == z) {
					if(Math.abs(y - w) == 2) {
						if(y > w && this.isInBounds(x, y - 1) && !this.isEmpty(x, y - 1)) {
							return true;
						}
						if(w > y && this.isInBounds(x, w - 1) && !this.isEmpty(x, w - 1)) {
							return true;
						}
					}
				}
				if(y == w) {
					if(Math.abs(x - z) == 2) {
						if(x > z && this.isInBounds(x - 1, y) && !this.isEmpty(x - 1, y)) {
							return true;
						}
						if(z > x && this.isInBounds(z - 1, y) && !this.isEmpty(z - 1, y)) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	
	/* Returns the coordinate of the peg that is 'eaten' during the move from arg 1 to arg 2 */
	eaten([x,y],[z,w]) {
		if(Math.abs(y - w) == 2) {
			if(y > w) {
				return [x, y - 1];
			}
			if(w > y) {
				return [x, w - 1];
			}
		}
		if(Math.abs(x - z) == 2) {
			if(x > z) {
				return [x - 1, y];
			}
			if(z > x) {
				return [z - 1, y];
			}
		}
	}
	
	/* If possible to make a move from arg 1 to arg 2 - performs the move */
	move([x,y],[z,w]) {
		if(this.isLegalMove([x,y],[z,w])) {
			var eat = this.eaten([x,y],[z,w]);
			this.board[x][y] = '0';
			this.board[eat[0]][eat[1]] = '0';
			this.board[z][w] = '1';
			this.pegs--;
			this.moveQueue.push(this.toString());
			return true;
		}
		return false;
	}
	
	/* Reverses the move from arg 1 to arg 2 */
	reverseMove([x,y],[z,w]) {
		var eat = this.eaten([z,w],[x,y]);
		this.board[z][w] = '0';
		this.board[eat[0]][eat[1]] = '1';
		this.board[x][y] = '1';
		this.pegs++;
		this.moveQueue.pop();
	}
	
	/* Checks if there is only one peg left and it is in the middle of the board */
	checkWin() {
		if(this.board[3][3] == '1' && this.pegs == 1 ) {
			return true;
		}
		return false;
	}
	
	/* Prints the board to the screen */
	printBoard() {
		document.write(this.toString());
	}
	
	/* Prints the entire move queue */
	printMoveQueue() {
		for(var i = 0; i < this.moveQueue.length; i++) {
			document.write(this.moveQueue[i]);
		}
	}
	
	/* Returns a string representation of the board */
	toString() {
		var string = "";
		var i,j;
		for(i = 0; i < 7; i++) {
			for(j = 0; j < 7; j++) {
				string += this.board[i][j] + " ";
			}
			string += "<br>"
		}
		string += "<br>"
		return string;
	}
	
	/* Returns the board's unique ID. 
	 * The smallest binary representation of the 8 equivalent boards (rotated and flipped), converted to decimal.
	 */
	toUID() {
		var binReps = ["", "", "", "", "", "", "", ""];
		
		for(var i = 0; i < 7; i++) {
			for(var j = 0; j < 7; j++) {
				binReps[0] += this.board[i][j];
				binReps[4] += this.board[j][i];
			}
		}
		
		for(var i = 6; i >= 0; i--) {
			for(var j = 0; j < 7; j++) {
				binReps[1] += this.board[j][i];
				binReps[7] += this.board[i][j];
			}
		}
		
		for(var i = 6; i >= 0; i--) {
			for(var j = 6; j >= 0; j--) {
				binReps[2] += this.board[i][j];
				binReps[6] += this.board[j][i];
			}
		}
		
		for(var i = 0; i < 7; i++) {
			for(var j = 6; j >= 0; j--) {
				binReps[3] += this.board[j][i];
				binReps[5] += this.board[i][j];
			}
		}
		
		// Replace 'x' with '0' and convert to decimal.
		for(var i = 0; i < 8; i++) {
			binReps[i] = binReps[i].replace(/x/g, '0');
			binReps[i] = parseInt(binReps[i], 2);
		}
		
		return Math.min(...binReps);
	}
}

/* First attempted algorithm. Has a long run-time. */
function solvePegSol(board) {
	if(board.checkWin()) {
		board.printMoveQueue();
		return true;
	}
	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 7; j++) {
			for(var k = -2; k <= 2; k += 2) {
				for(var l = -2; l <= 2; l += 2) {
					if((k == 0 || l == 0) && !(k == 0 && l == 0)) {
						if(board.move([i,j], [i + k, j + l])) {
							if(solvePegSol(board)) {
								return true;
							}
							board.reverseMove([i,j], [i + k, j + l]);
						}
					}
				}
			}
		}
	}
	return false;
}

/* Improved algorithm. For every board checks if an equivalent board already failed. */
function solvePegSolSym(board) {
	if(board.checkWin()) {
		board.printMoveQueue();
		return true;
	}
	if(checkFlagged(board)) {
		return false;
	}
	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 7; j++) {
			for(var k = -2; k <= 2; k += 2) {
				for(var l = -2; l <= 2; l += 2) {
					if((k == 0 || l == 0) && !(k == 0 && l == 0)) {
						if(board.move([i,j], [i + k, j + l])) {
							if(solvePegSolSym(board)) {
								return true;
							}
							board.reverseMove([i,j], [i + k, j + l]);
						}
					}
				}
			}
		}
	}
	flagBoard(board);
	return false;
}

/* Flag the board as unsolvable */
function flagBoard(board) {
	flagged.push(board.toUID());
}

/* Check if the board was flagged as unsolvable before */
function checkFlagged(board) {
	var uid = board.toUID();
	
	for(var i = 0; i < flagged.length; i++) {
		if(flagged[i] == uid) {
			return true;
		}
	}
	return false;
}

var flagged = [];

var b = new PegSolBoard();
b.printBoard();
solvePegSolSym(b);