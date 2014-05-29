var runTest = function() {
	player.position.x = 263;
	player.position.y = 428;
	setTimeout(function() {
		moveRight();
		jump();
		
	}, 1000);
};