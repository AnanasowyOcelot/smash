var mapTiles = [
	'...................................................',
	'...................................................',
	'...................................................',
	'...................................................',
	'...................................................',
	'...................................................',
	'...................................................',
	'.............wwwwwwwwwwwww.........................',
	'.............wwwwwwwwwwwww.....................wwww',
	'.............wwwwwwwwwwwwww.................wwwwwww',
	'.............wwwwwwwwwwwwwwwww...........wwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww.........wwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
	'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
	];
	

var rozmiarPola = 5;

var mapTilesAvalanche = function(mapTiles) {
	var replaceAt = function(string, index, character) {
		return string.substr(0, index) + character + string.substr(index+character.length);
	}
	
	for (var y=0; y<mapTiles.length - 1; y++) {
		for (var x=0; x<mapTiles[y].length; x++) {
			if (mapTiles[y].charAt(x) == "w" && mapTiles[y+1].charAt(x) == ".") {
				mapTiles[y] = replaceAt(mapTiles[y], x, ".");
				mapTiles[y+1] = replaceAt(mapTiles[y+1], x, "w");
			}
		}
	}
}



var map = {
	rozmiarPola: rozmiarPola,
	height: (mapTiles.length * rozmiarPola),
	width:  (mapTiles[0].length * rozmiarPola)
};


var getFloorY = function(position) {
	var playerY = Math.floor(position.y / rozmiarPola);
	var playerX = Math.floor(position.x / rozmiarPola);

	if (playerY > mapTiles.length - 1) {
		playerY = mapTiles.length - 1;
	}
	while (mapTiles[playerY][playerX] !== "w") {
		playerY += 1;
		if (mapTiles[playerY][playerX] == "w") {
			return playerY * rozmiarPola;
		}
	}
	return playerY * rozmiarPola;
}


	
var buildGround = function (x, y) {
	var ground = document.createElement("div");
	ground.className = "ground";
	ground.style.top = rozmiarPola * x;
	ground.style.left = rozmiarPola * y;

	document.getElementById('area').appendChild(ground);
};

var buildBackground = function (x, y){
	var background = document.createElement("div");
	background.className = "background";
	background.style.top = rozmiarPola * x;
	background.style.left = rozmiarPola * y;

	document.getElementById('area').appendChild(background);
};


var mapBuild = function() {
	var x = 0;
	var y = 0;
	for (var i = 0; i < $(document).height() / rozmiarPola; i++) {
		y = 0;
		for (var j = 0; j < $(document).width() / rozmiarPola; j++) {
			if(mapTiles[i][j] == "w") {
				buildGround(x,y);
			} else {
				buildBackground(x, y);
			}
			y++;
		}
		x++;
	};
};

var mapDestroy = function() {
	$('.ground').remove();
	$('.background').remove();
	
}

var mapRefresh = function() {
	mapDestroy();
	mapBuild();
	drawCanvasLines();
}

//mapBuild();
drawCanvasLines();


var img = new Image();
img.addEventListener('load', function () {
	var context = document.getElementById('imgCanvas').getContext('2d');
	context.drawImage(img, 0, 0);
	data = context.getImageData(0, 0, this.width, this.height).data;
	
	
	var mapTilesCow = [];
	var lineLength = data.length/this.height
	for (var lineNumber=0; lineNumber < this.height; lineNumber++) {
		var mapTiles2 = "";
		for (var pixel=lineLength*lineNumber; pixel < lineLength + lineLength * lineNumber; pixel+=4) {
			if(data[pixel] == 0) {
				mapTiles2 += "w";
			}else{
				mapTiles2 += ".";
			}
		}
		//console.log(mapTiles2);
		mapTilesCow.push(mapTiles2);
		
	};
	
	mapTiles = mapTilesCow;
	
	map.height = mapTiles.length * rozmiarPola;
	map.width = mapTiles[0].length * rozmiarPola;
	drawCanvasLines();
	$("#imgCanvas").remove();
});
img.src = 'map_300x200_war.png';



