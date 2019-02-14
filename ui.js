function drawBoard() {
	// Board div.
	var boardElem = document.createElement("div");
	boardElem.setAttribute("id", "board");
	document.body.appendChild(boardElem);
	
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
				holeElem.setAttribute("onmouseup", "holeClicked(this)");
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
	}
}

function tryMove() {
	var src = parseCoords(selected1.getAttribute("id"));
	var dest = parseCoords(selected2.getAttribute("id"));
	
	if(b.move(src, dest)) {
		moveGraphics(src, dest);
		return true;
	}
	return false;
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

var selected1 = false;
var selected2 = false;
var illegalMove = false;

drawBoard();
var b = new PegSolBoard();