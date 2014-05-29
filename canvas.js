
var canvasSize = {
		width: $(document).width(),
		height: $(document).height()
	};

setInterval(function() {
		canvasSize.width = $(document).width(),
		canvasSize.height = $(document).height()
	}, 200);


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
	//ctx.canvas.width  = canvasSize.width;
	//ctx.canvas.height = canvasSize.height;

setInterval(function() {
		ctx.canvas.width  = canvasSize.width;
		ctx.canvas.height = canvasSize.height;
		drawCanvasLines();
	}, 200);

var getFloorYForCanvas = function(x, y) {
	var newY = Math.floor(y / rozmiarPola);
	var newX = Math.floor(x / rozmiarPola);

	if (newY > mapTiles.length - 1) {
		newY = mapTiles.length - 1;
	}
	while (mapTiles[newY][newX] !== "w") {
		newY += 1;
		if (mapTiles[newY][newX] == "w") {
			return newY * rozmiarPola;
		}
	}
	return newY * rozmiarPola;
}


var drawCanvasLines = function() {
	ctx.clearRect(0, 0, map.width, map.height);
	ctx.beginPath();
	ctx.moveTo(0, getFloorYForCanvas(0, 0));
	for (var i = rozmiarPola/2; i < map.width; i = i + rozmiarPola) {
	
		ctx.lineTo(i,getFloorYForCanvas(i, 0))
	}
	ctx.lineTo(map.width, map.height)
	ctx.lineTo(0, map.height)
	ctx.fillStyle = '#000000';
    ctx.fill();
	ctx.closePath();
	ctx.stroke();

} 


