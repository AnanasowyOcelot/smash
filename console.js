var timeStartsForConsole = new Date().getTime() / 1000

var createConsol = function() {
	var consol = document.createElement('div')
	consol.className = "console"
	document.getElementById('body').appendChild(consol)
	
	var timeActualForConsole = new Date().getTime() / 1000
	
	$('.console').html("PositionX: "+ Math.round(player.position.x)
		+ "<br>" + "PositionY: " + Math.round(player.position.y)
		+ "<br>" + "SpeedX: " + Math.abs(Math.round(player.speed.x))
		+ "<br>" + "SpeedY: " + Math.abs(Math.round(player.speed.y))
		+ "<br>"  + Math.round((timeActualForConsole - timeStartsForConsole)) + " seconds playing"
		+ "<br>num particles: " + numPart
		+ "<br />isOnFloor: " + isOnFloor(player)
		+ "<br />isOverFloor: " + isOverFloor(player)
		+ "<br />isUnderFloor: " + isUnderFloor(player)
		);//<span id='numParticles'></span>");
};

var refreshConsol = function() {
	createConsol();
	$('.console').remove();
	createConsol();
};