var player = {
    direction: 1,
    width: 50,
    height: 75,
    position: {
        x: 50,
        y: 200
    },
    speed: {
        x: 0,
        y: 0
    },
    setFeetPositionY: function (newFeetPositionY) {
        this.position.y = newFeetPositionY - this.height;
    },
    getPlayerFeetPosition: function () {
        return {x: this.position.x + this.width / 2, y: this.position.y + this.height};
    },
    stats: {
        maxSpeedX: 10,
        jumpStrength: 20,
        smashHight: 8,
        strength: 20
    },
    isSmashing: false,
    isSmashingFront: false
};

var playerMoveClasses = ["player playerMove1", "player playerMove2", "player playerMove3", "player playerMove4"]
var licznik = 0;

var setPlayerLook = function (player) {
    if (player.speed.y > 0 && player.isSmashing == false && player.isSmashingFront == false) {
        document.getElementById("player").className = "player playerJumpUp"
    } else if (player.speed.y < 0 && player.isSmashing == false && player.isSmashingFront == false) {
        document.getElementById("player").className = "player playerJumpDown"
    } else if (player.speed.y == 0 && player.speed.x == 0 && player.isSmashing == false && player.isSmashingFront == false) {
        document.getElementById("player").className = "player playerMove"
    } else if (player.speed.y == 0 && player.speed.x !== 0 && player.isSmashing == false && player.isSmashingFront == false) {
        document.getElementById("player").className = playerMoveClasses[licznik]
    } else if (player.isSmashing == true && player.isSmashingFront == false) {
        document.getElementById("player").className = "player playerSmash"
    } else if (player.isSmashingFront == true) {
        document.getElementById("player").className = "player playerSmashFront"
    }
};


var getFloorPositionY = function () {
    return getFloorY(player.getPlayerFeetPosition());
};


var keyCode = {
    left: 37,
    right: 39,
    up: 38,
    down: 40,
    space: 32
};

var setPlayerPosition = function (position) {
    var playerElement = document.getElementById("player");

    playerElement.style.left = position.x;
    playerElement.style.top = position.y;

    if (player.direction == -1) {
        $('#player').addClass('mirror');
    } else {
        $('#player').removeClass('mirror');
    }
}

var applySpeed = function (player) {
    if (player.speed.x < 0) {
        player.direction = -1;
    } else if (player.speed.x > 0) {
        player.direction = 1;
    }

    var newPlayerPositionX = player.position.x + player.speed.x;
    var newPlayerPositionY = player.position.y + player.speed.y;

    newPlayerPositionX = Math.max(0, newPlayerPositionX);
    newPlayerPositionX = Math.min(map.width - player.width, newPlayerPositionX);
    newPlayerPositionY = Math.max(0, newPlayerPositionY);
    newPlayerPositionY = Math.min(map.height - player.height, newPlayerPositionY);
    if (isPositionAllowed(newPlayerPositionX, newPlayerPositionY)) {
        player.position.x = newPlayerPositionX;
        player.position.y = newPlayerPositionY;
    } else {
        player.speed.x = 0;
        player.speed.y = 0;
        player.position.y -= 1;
    }

};

var isPositionAllowed = function (x, y) {
    var xMapPosition = Math.floor((x + player.width / 2) / rozmiarPola)
    var yMapPosition = Math.floor((y + player.height * 0.70) / rozmiarPola)
    if (mapTiles[yMapPosition] != undefined && mapTiles[yMapPosition][xMapPosition] != undefined) {
        if (mapTiles[yMapPosition][xMapPosition] == ".") {
            return true
        } else {
            return false
        }
    }

};


var moveRight = function () {
    //if (isOnFloor(player)) {
    player.speed.x += player.stats.strength;
    player.speed.x = Math.min(player.stats.maxSpeedX, player.speed.x);
    //}
};

var moveLeft = function () {
    //if (isOnFloor(player)) {
    player.speed.x -= player.stats.strength;
    player.speed.x = Math.max(-player.stats.maxSpeedX, player.speed.x);
    //}
};

var jump = function () {
    if (isOnFloor(player)) {
        player.speed.y = -player.stats.jumpStrength;
    }
};


var handleKeyPressed = function (e) {

    if (!e) {
        e = window.event;
    } else {
        switch (e.keyCode) {
            case keyCode.left:
                moveLeft();
                e.preventDefault();
                break;
            case keyCode.right:
                moveRight();
                e.preventDefault();
                break;
            case keyCode.up:
                jump();
                e.preventDefault();
                break;
            case keyCode.space:
                if (canSmash(player)) {
                    player.isSmashing = true
                } else {
                    player.isSmashingFront = true;
                    frontSmash(player.position);
                }
                e.preventDefault();
                break;
        }
    }

};

document.onkeydown = handleKeyPressed;

var applyGravity = function (player) {
    if (isOverFloor(player)) {
        player.speed.y += 1;
    }
};

var applyFriction = function (player) {
    player.speed.x *= 0.6;
    if (Math.abs(player.speed.x) < 1) {
        player.speed.x = 0;
    }
};

var frontSmash = function (position) {
    var playerY = Math.floor(position.y / rozmiarPola);
    var playerX = Math.floor(position.x / rozmiarPola);
    //console.log(player.direction);
    if (player.direction == 1) {
        if (mapTiles[Math.round(playerY + player.height / rozmiarPola / 2)][Math.round(playerX + 10)] == 'w') {


            for (var y = -15; y < 25; y++) {
                for (var x = 0; x < 40; x++) {
                    var yToRemove = playerY + y;
                    var xToRemove = playerX + x;
                    var vector = Math.sqrt((yToRemove - playerY) * (yToRemove - playerY) + (xToRemove - playerX) * (xToRemove - playerX))
                    var row = mapTiles[yToRemove];
                    if (vector < 15) {
                        var updatedRow = replaceCharAt(row, '.', xToRemove);
                        mapTiles[yToRemove] = updatedRow;
                    }

                }

            }
            ParticleGenerator.addGenerator({
                _ticksLeft: 2,
                getStartX: function () {
                    return position.x + player.width;
                },
                getStartY: function () {
                    return position.y + player.height / 2;
                },
                getAmount: function () {
                    return 5;
                },
                getTicksLeft: function () {
                    this._ticksLeft--;
                    return this._ticksLeft;
                },
                getColor: function () {
                    return 'black';
                },
                applyForce: function () {
                    return false;
                },
                getSizeX: function () {
                    return 12;
                },
                getSizeY: function () {
                    return 14;
                },
                getSpeedX: function () {
                    return (Math.random() - 0.5) * 20;
                },
                getSpeedY: function () {
                    return (Math.random() - 1) * 20;
                }
            });
            drawCanvasLines();
        }

    } else if (player.direction == -1) {
        //console.log('pac!');
        //console.log(mapTiles[Math.round(playerY + player.height / rozmiarPola / 2)][Math.round(playerX)]);

        if (mapTiles[Math.round(playerY + player.height / rozmiarPola / 2)][Math.round(playerX)] == 'w') {

            for (var y = -15; y < 25; y++) {
                for (var x = -30; x < 10; x++) {
                    var yToRemove = playerY + y;
                    var xToRemove = playerX + x;
                    var vector = Math.sqrt((yToRemove - playerY) * (yToRemove - playerY) + (xToRemove - playerX) * (xToRemove - playerX))
                    var row = mapTiles[yToRemove];
                    if (vector < 15) {
                        var updatedRow = replaceCharAt(row, '.', xToRemove);
                        mapTiles[yToRemove] = updatedRow;
                    }

                }

            }
            ParticleGenerator.addGenerator({
                _ticksLeft: 2,
                getStartX: function () {
                    return position.x + player.width;
                },
                getStartY: function () {
                    return position.y + player.height / 2;
                },
                getAmount: function () {
                    return 5;
                },
                getTicksLeft: function () {
                    this._ticksLeft--;
                    return this._ticksLeft;
                },
                getColor: function () {
                    return 'black';
                },
                applyForce: function () {
                    return false;
                },
                getSizeX: function () {
                    return 12;
                },
                getSizeY: function () {
                    return 14;
                },
                getSpeedX: function () {
                    return (Math.random() - 0.5) * 20;
                },
                getSpeedY: function () {
                    return (Math.random() - 1) * 20;
                }
            });
            drawCanvasLines();
            //mapRefresh();
        }
    }


    setTimeout(function () {
        player.isSmashingFront = false}, 200)
}

var hulkSmash = function (position) {
    player.isSmashing = false;
    var playerY = Math.floor(position.y / rozmiarPola);
    var playerX = Math.floor(position.x / rozmiarPola);

    for (var y = -20; y < 20; y++) {
        for (var x = -20; x < 20; x++) {
            var yToRemove = playerY + y;
            var xToRemove = playerX + x;
            var vector = Math.sqrt((yToRemove - playerY) * (yToRemove - playerY) + (xToRemove - playerX) * (xToRemove - playerX))
            var row = mapTiles[yToRemove];
            if (vector < 10) {
                var updatedRow = replaceCharAt(row, '.', xToRemove);
                mapTiles[yToRemove] = updatedRow;
            }

        }

    }
    ParticleGenerator.addGenerator({
        _ticksLeft: 2,
        getStartX: function () {
            return position.x;
        },
        getStartY: function () {
            return position.y + 50;
        },
        getAmount: function () {
            return 5;
        },
        getTicksLeft: function () {
            this._ticksLeft--;
            return this._ticksLeft;
        },
        getColor: function () {
            return 'black';
        },
        applyForce: function () {
            return false;
        },
        getSizeX: function () {
            return 12;
        },
        getSizeY: function () {
            return 14;
        },
        getSpeedX: function () {
            return (Math.random() - 0.5) * 20;
        },
        getSpeedY: function () {
            return (Math.random() - 1) * 20;
        }
    });
    drawCanvasLines();
    //mapRefresh();
};

var numPart = 0;

var upNumPart = function (num) {
    numPart = num;
    //$('#numParticles').html(num);
}


var isOnFloor = function (player) {
    if (player.getPlayerFeetPosition().y >= getFloorPositionY()) {
        return true
    } else {
        return false
    }
};

var isUnderFloor = function (player) {
    if (player.getPlayerFeetPosition().y > getFloorPositionY()) {
        return true
    } else {
        return false
    }
};

var isOverFloor = function (player) {
    if (player.getPlayerFeetPosition().y < getFloorPositionY()) {
        return true
    } else {
        return false
    }
};

var canSmash = function (player) {
    if (player.speed.y > player.stats.smashHight) {
        return true
    } else {
        return false
    }
}


var replaceCharAt = function (string, character, index) {
    return string.substr(0, index) + character + string.substr(index + 1);
};

var tick = function () {
    applyGravity(player);
    applySpeed(player);
    if (isUnderFloor(player)) {
        //console.log(player);
        player.speed.y = 0;
        player.setFeetPositionY(getFloorPositionY());

        if (player.isSmashing) {
            hulkSmash(player.getPlayerFeetPosition());
        }
    }
    setPlayerLook(player);
    if (isOnFloor(player)) {
        applyFriction(player);
    }
    setPlayerPosition(player.position);

    licznik += 1;
    if (licznik > playerMoveClasses.length - 1) {
        licznik = 0
    }
    window.scrollTo(player.position.x, player.position.y);
    refreshConsol();

};
var slowerTick = function () {
    mapTilesAvalanche(mapTiles);
}
setInterval(tick, 30);
setInterval(slowerTick, 80)
