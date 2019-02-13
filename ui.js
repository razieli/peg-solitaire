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
	document.getElementById("hole3_3").style.backgroundColor = "#000000";
}

function holeClicked(element) {
	if(!selected1 && (element.style.backgroundColor == "#000000" || element.style.backgroundColor == "rgb(0, 0, 0)")) {
		return;
	}
	if(illegalMove) {
		var src = parseCoords(selected1.getAttribute("id"));
		var dest = parseCoords(selected2.getAttribute("id"));
		console.log(src[0]);
		if(b.isEmpty(src[0], src[1])) {
			selected1.style.backgroundColor = "#000000";
		} else {
			selected1.style.backgroundColor = "#00FF00";
		}
		if(b.isEmpty(dest[0], dest[1])) {
			selected2.style.backgroundColor = "#000000";
		} else {
			selected2.style.backgroundColor = "#00FF00";
		}
		selected1 = false;
		selected2 = false;
		illegalMove = false;
	}
	if(!selected1) {
		selected1 = element;
		selected1.style.backgroundColor = "#0000FF";
	} else {
		if(element == selected1) {
			element.style.backgroundColor = "#00FF00";
			selected1 = false;
			return;
		}
		selected2 = element;
		if(!tryMove()) {
			selected2.style.backgroundColor = "#FF0000";
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
	selected1.style.backgroundColor = "#000000";
	selected2.style.backgroundColor = "#00FF00";
	
	var eatenCoords = b.eaten(src, dest);
	var eatenElemId = parseElemId(eatenCoords);
	var eatenElem = document.getElementById(eatenElemId);
	eatenElem.style.backgroundColor = "#000000";
}

var selected1 = false;
var selected2 = false;
var illegalMove = false;

drawBoard();
var b = new PegSolBoard();