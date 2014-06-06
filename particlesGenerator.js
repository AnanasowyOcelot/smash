ParticleGenerator = (function () {
    var Particle = function () {
        this.position = {
            x: 0,
            y: 0
        };
        this.speed = {
            x: 0,
            y: 0
        };
        this.weight = 1;
        this.size = {
            x: 0,
            y: 0
        };
        this.ticksLeft = 0;
        this.toDelete = false;
        this.color = 'black';
        this.applyForce = true;
    };


    var canvasArea = {
        width: $(document).width(),
        height: $(document).height()
    };

    setInterval(function () {
        canvasArea.width = $(document).width(),
            canvasArea.height = $(document).height()
    }, 200);


    var DarkParticle = function () {
        this.position = {
            x: 0,
            y: 0
        };
        this.size = {
            x: 0,
            y: 0
        };
    }

    var c = document.getElementById("myCanvasPart");
    var ctx = c.getContext("2d");

    var drawCanvasPixel = function (position, size, ticksLeft, color) {

        ctx.fillStyle = color;

        //ctx.fillStyle = "#FF4000";
        ctx.beginPath();
        ctx.fillRect(position.x, position.y, size.x, size.y);
        ctx.stroke();

    }

    var refreshCanvasArea = function (canvasArea) {

        ctx.canvas.width = canvasArea.width;
        ctx.canvas.height = canvasArea.height;
        ctx.fillStyle = "#0B173B";
        ctx.beginPath();
        ctx.fillRect(0, 0, canvasArea.width, canvasArea.height);
        ctx.stroke();
    }

    var applySpeed = function (canvasParticle) {
        var newPositionX = canvasParticle.position.x + canvasParticle.speed.x;
        var newPositionY = canvasParticle.position.y + canvasParticle.speed.y;

        canvasParticle.position.x = newPositionX;
        canvasParticle.position.y = newPositionY;
        if (canvasParticle.position.x >= canvasArea.width || canvasParticle.position.x <= 0) {
            canvasParticle.toDelete = true;
        } else if (canvasParticle.position.y >= canvasArea.height || canvasParticle.position.y <= 0) {
            canvasParticle.toDelete = true;
        }
    };


    var applyGravity = function (canvasParticle) {
        canvasParticle.speed.y += canvasParticle.weight;
    };

    var applyForce = function (canvasParticle, darkParticle) {
        if(canvasParticle.applyForce == true) {
            var particleDistanceX = darkParticle.position.x - canvasParticle.position.x;
            var particleDistanceY = darkParticle.position.y - canvasParticle.position.y;

            var particleDistance = Math.sqrt(particleDistanceX * particleDistanceX + particleDistanceY * particleDistanceY);

            var forceVector = {
                x: particleDistanceX * 15000 / (particleDistance * particleDistance * particleDistance),
                y: particleDistanceY * 15000 / (particleDistance * particleDistance * particleDistance)
            };
            canvasParticle.speed.x -= forceVector.x;
            canvasParticle.speed.y -= forceVector.y;
        }

    };


    var createTickFunction = function () {
        return function () {
            getPos(player);
            refreshCanvasArea(canvasArea);
            for (var i = 0; i < particleArr.length; i++) {
                var particle = particleArr[i];
                particle.ticksLeft--;
                if (particle.ticksLeft <= 0) {
                    particleArr.toDelete = true;
                } else {
                    drawCanvasPixel(particle.position, particle.size, particle.ticksLeft, particle.color);
                    applyGravity(particle);
                    applyForce(particle, darkParticle);
                    applySpeed(particle);
                }
            }
            var newParticleArr = []
            for (var i = 0; i < particleArr.length; i++) {
                var particle = particleArr[i];
                if (particle.toDelete != true) {
                    newParticleArr.push(particle);
                }
            }
            particleArr = newParticleArr;
            //upNumPart(particleArr.length);

        };
    };

    var createParticle = function (x, y, color, applyForce, sizeX, sizeY, speedX, speedY) {
        var particle = new Particle();
        particle.color = color;
        particle.applyForce = applyForce;
        particle.position.x = x;
        particle.position.y = y;
        particle.speed.x = speedX;
        particle.speed.y = speedY;
        particle.size.x = sizeX;
        particle.size.y = sizeY;
        particle.ticksLeft = 10 + 100;// * Math.random();
        return particle;
    }

    var createDarkParticle = function (x, y) {
        var darkParticle = new DarkParticle();
        console.log(darkParticle);
        darkParticle.position.x = x;
        darkParticle.position.y = y;
        darkParticle.size.x = 10;
        darkParticle.size.y = 10;
        return darkParticle;
    }

    var particleArr = [];

    var generators = [];
    var addGenerator = function (newGenerator) {
        generators.push(newGenerator);
    };

    var addParticles = function () {
        for (var genNum = 0; genNum < generators.length; genNum++) {
            var generator = generators[genNum];
            if (generator.getTicksLeft() > 0) {
                var amount = generator.getAmount();
                for (var i = 0; i < amount; i++) {
                    var canvasParticle = createParticle(
                        generator.getStartX(),
                        generator.getStartY(),
                        generator.getColor(),
                        generator.applyForce(),
                        generator.getSizeX(),
                        generator.getSizeY(),
                        generator.getSpeedX(),
                        generator.getSpeedY()
                    );
                    particleArr.push(canvasParticle);
                }
            }
        }

        // TODO: remove dead generators

        /*for (var i = 0; i < 100; i++) {
         var canvasParticle = createParticle(Math.random() * canvasArea.width, 0);
         particleArr.push(canvasParticle);
         }*/
    }

    var tickFunction = createTickFunction();

    var getPos = function (player) {
        x = player.position.x;
        y = player.position.y;
        darkParticle.position.x = x;
        darkParticle.position.y = y;
    }

    var darkParticle = createDarkParticle(400, 200);

    setInterval(tickFunction, 50);

    setInterval(addParticles, 150);

    setInterval(function () {
        upNumPart(particleArr.length);
    }, 50);

    return {
        addGenerator: addGenerator
    };
})();

// rain:
ParticleGenerator.addGenerator({
    getStartX: function () {
        return Math.random() * map.width;
    }, // TODO: dynamically set width
    getStartY: function () {
        return 0;
    },
    getAmount: function () {
        return 100;
    },
    getTicksLeft: function () {
        return 1;
    },
    getColor: function () {
        return '#0B0B61';
    },
    applyForce: function() {
        return true;
    },
    getSizeX: function(){
        return 3;
    },
    getSizeY: function(){
        return 6;
    },
    getSpeedX: function() {
        return (Math.random() - 0.5) * 20;
    },
    getSpeedY: function() {
        return (Math.random() - 0.5) * 20;
    }
});

// smash particles:


// TODO: wyciągnąć ze środka prędkość startową, rozmiar particli i MAPA!!!
/*
 // nyan cat:
 ParticleGenerator.addGenerator({
 _ticksLeft: 100,
 getStartX: function () {return pozycjaXDupyHulka - 30;},
 getStartY: function () {return pozycjaYDupyHulka;},
 getAmount: function () {return 100;},
 getTicksLeft: function () {
 this._ticksLeft --;
 return this._ticksLeft;
 }
 });
 */