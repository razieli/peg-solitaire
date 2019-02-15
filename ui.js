function drawBoard() {
	// Board div.
	var boardElem = document.getElementById("board");
	
	// Pegs/holes.
	for(var i = 0; i < 7; i++) {
		var rowElem = document.createElement("div");
		rowElem.setAttribute("id", "row"+i);
		rowElem.setAttribute("class", "row");
		boardElem.appendChild(rowElem);
		for(var j = 0; j < 7; j++) {
			var holeElem = document.createElement("span");
			holeElem.setAttribute("id", "hole"+i+"_"+j);
			holeElem.setAttribute("class", "hole");
			if(((i < 2 || i > 4) && (j < 2 || j > 4))) {
				holeElem.setAttribute("class", "hole inactive");
			} else {
				enableInputEvents(holeElem);
			}
			rowElem.appendChild(holeElem);
		}
	}
	emptyHole(document.getElementById("hole3_3"));
}

function holeClicked(element) {
	if(!selected1 && isEmpty(element)) {
		return;
	}
	if(illegalMove) {
		deselectHole(selected1);
		unmarkIllegalDestHole(selected2);
		
		selected1 = false;
		selected2 = false;
		illegalMove = false;
	}
	if(!selected1) {
		selected1 = element;
		selectHole(selected1);
	} else {
		if(element == selected1) {
			deselectHole(selected1);
			selected1 = false;
			return;
		}
		selected2 = element;
		if(!tryMove()) {
			markIllegalDestHole(selected2);
			illegalMove = true;
		}
		if(!illegalMove) {
			selected1 = false;
			selected2 = false;
		}
		if(b.checkWin()) {
			endGame(true);
		}
		else if(b.checkGameOver()) {
			endGame(false);
		}
	}
}

function tryMove() {
	var src = parseCoords(selected1.getAttribute("id"));
	var dest = parseCoords(selected2.getAttribute("id"));
	
	if(b.move(src, dest)) {
		moveGraphics(src, dest);
		drawStats();
		return true;
	}
	return false;
}

function endGame(win) {
	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 7; j ++) {
			var holeElem = document.getElementById("hole"+i+"_"+j);
			if(holeElem.hasAttribute("onmouseup")) {
				disableInputEvents(holeElem);
			}
		}
	}
	if(win) {
		document.getElementById("game-status").innerHTML = "Congratulations, you won.";
	} else {
		document.getElementById("game-status").innerHTML = "Game over.";
	}
}

function parseCoords(elemId) {
	var x = parseInt(elemId.charAt(4));
	var y = parseInt(elemId.charAt(6));
	return [x,y];
}

function parseElemId(coords) {
	return "hole" + coords[0] + "_" + coords[1];
}

function moveGraphics(src, dest) {
	deselectHole(selected1);
	emptyHole(selected1);

	fillHole(selected2);
	
	var eatenCoords = b.eaten(src, dest);
	var eatenElemId = parseElemId(eatenCoords);
	var eatenElem = document.getElementById(eatenElemId);
	emptyHole(eatenElem);
}

function emptyHole(holeElem) {
	holeElem.style = "";
	holeElem.classList.add("empty");
}

function fillHole(holeElem) {
	holeElem.classList.remove("empty");
}

function selectHole(holeElem) {
	holeElem.classList.add("selected");
}

function deselectHole(holeElem) {
	holeElem.classList.remove("selected");
}

function markIllegalDestHole(holeElem) {
	holeElem.classList.add("illegal");
}

function unmarkIllegalDestHole(holeElem) {
	holeElem.classList.remove("illegal");
}

function isEmpty(holeElem) {
	return holeElem.classList.contains("empty");
}

function updatePegStat() {
	document.getElementById("pegs-value").innerHTML = b.pegs;
}

function updateMoveStat() {
	document.getElementById("moves-value").innerHTML = b.moves;
}

function drawStats() {
	updatePegStat();
	updateMoveStat();
}

function enableInputEvents(holeElem) {
	holeElem.setAttribute("onmouseup", "holeClicked(this)");
	holeElem.setAttribute("ontouchstart", "holeClicked(this)");
}

function disableInputEvents(holeElem) {
	holeElem.removeAttribute("onmouseup");
	holeElem.removeAttribute("ontouchstart");
}

var selected1 = false;
var selected2 = false;
var illegalMove = false;

var b = new PegSolBoard();
drawBoard();
drawStats();
