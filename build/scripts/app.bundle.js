(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var createSubClass = require('../utils/create_subclass')
    , Container = createjs.Container
    , BasicCar = require('./car/BasicCar')

module.exports = createSubClass(Container, 'Hero', {
    initialize: Hero$initialize,
    fire: Hero$fire,
    getCar: Hero$getCar,
    tick: Hero$tick
});

function Hero$initialize(name, carId, x, y) {
    Container.prototype.initialize.apply(this,arguments);
    this.name = name;
    this.x = x;
    this.y = y;
    this.car = new BasicCar();

    setupDisplay.call(this);
}

function setupDisplay() {
    this.body = this.car.getContainer();
    this.addChild(this.body);
}

function Hero$fire() {
    console.log("fire");
}

function Hero$getCar() {
    return this.car;
}

function Hero$tick() {
}
},{"../utils/create_subclass":6,"./car/BasicCar":4}],2:[function(require,module,exports){
'use strict';

var createSubClass = require('../utils/create_subclass')
    ,Container = createjs.Container
    ,randomVectors = {};

module.exports = createSubClass(Container, 'World', {
    initialize: World$initialize
});

function World$initialize(sizeX, sizeY) {
    this.randomPoints = {};
    this.centerPoints = [];

    for (var x=0; x<sizeX; x++) {
        for (var y = 0; y < sizeY; y++) {
            this.randomPoints[ x + ";" + y ] = getRandomInt(1,10);
        }
    }

    for (var x=0; x<sizeX; x++) {
        for (var y=0; y<sizeY; y++) {
            this.centerPoints.push({
                x: x,
                y: y,
                center: { x: x + 0.5, y: y + 0.5 },
                noise: Noise(x + 0.5, y + 0.5)
            });
        }
    }

    setupDisplay.call(this);
}

function setupDisplay() {
    var blockSizePx = 50;
    for (var index in this.centerPoints) {
        var item = this.centerPoints[index];
        if (item.noise>0) {
            var shape = new createjs.Shape();
            shape.graphics.beginFill(getColorForNoise(item.noise));
            shape.graphics.drawRect(0,0,blockSizePx,blockSizePx);
            shape.x = blockSizePx*item.x;
            shape.y = blockSizePx*item.y;
            this.addChild(shape);
        }
    }
}

function getColorForNoise(noise) {
    if (noise == 0) {
        return "#FFF";
    } else if ( noise == -0.25) {
        return "#FFF";
    } else if ( noise == -0.5) {
        return "#FFF";
    } else if ( noise == 0.25) {
        return "#8F8F8F";
    } else if ( noise == 0.5) {
        return "#595858";
    }
}

function Noise(fx, fy)
{
    // сразу находим координаты левой верхней вершины квадрата
    var left = parseInt(Math.floor(fx));
    var top  = parseInt(Math.floor(fy));

    // а теперь локальные координаты точки внутри квадрата
    var pointInQuadX = fx - left;
    var pointInQuadY = fy - top;

    // извлекаем градиентные векторы для всех вершин квадрата:
    var topLeftGradient     = GetPseudoRandomGradientVector(left,   top  );
    var topRightGradient    = GetPseudoRandomGradientVector(left+1, top  );
    var bottomLeftGradient  = GetPseudoRandomGradientVector(left,   top+1);
    var bottomRightGradient = GetPseudoRandomGradientVector(left+1, top+1);

    // вектора от вершин квадрата до точки внутри квадрата:
    var distanceToTopLeft     = [ pointInQuadX,   pointInQuadY ];
    var distanceToTopRight    = [ pointInQuadX-1, pointInQuadY ];
    var distanceToBottomLeft  = [ pointInQuadX,   pointInQuadY-1 ];
    var distanceToBottomRight = [ pointInQuadX-1, pointInQuadY-1 ];

    // считаем скалярные произведения между которыми будем интерполировать
    /*
     tx1--tx2
     |    |
     bx1--bx2
     */
    var tx1 = Dot(distanceToTopLeft,     topLeftGradient);
    var tx2 = Dot(distanceToTopRight,    topRightGradient);
    var bx1 = Dot(distanceToBottomLeft,  bottomLeftGradient);
    var bx2 = Dot(distanceToBottomRight, bottomRightGradient);

    // готовим параметры интерполяции, чтобы она не была линейной:
    pointInQuadX = QunticCurve(pointInQuadX);
    pointInQuadY = QunticCurve(pointInQuadY);

    // собственно, интерполяция:
    var tx = Lerp(tx1, tx2, pointInQuadX);
    var bx = Lerp(bx1, bx2, pointInQuadX);
    var tb = Lerp(tx, bx, pointInQuadY);

    // возвращаем результат:
    return tb;
}

/**
 * Линейная интерполяция
 * @param float a
 * @param float b
 * @param float t
 * @returns float
 */
function Lerp(a, b, t)
{
    return a + (b - a) * t;
}

/**
 * Искривление
 * @param float t
 * @returns float
 */
function QunticCurve(t)
{
    return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Псевдослучайный градиентный вектор
 * @param int x
 * @param int y
 * @returns int[]
 */
function GetPseudoRandomGradientVector(x, y)
{
    var v = GetRandomVector(x,y); // псевдо-случайное число от 0 до 3 которое всегда неизменно при данных x и y

    switch (v)
    {
        case 0:  return [1, 0];
        case 1:  return [-1, 0];
        case 2:  return [0, 1];
        default: return [0,-1];
    }
}

function GetRandomVector(x, y) {
    if (typeof randomVectors[x + ";" + y] == typeof undefined) {
        randomVectors[x + ";" + y] = getRandomInt(0,3);
    }
    return randomVectors[x + ";" + y];
}

/**
 * Скалярное произведение векторов
 * @param a
 * @param b
 * @returns int
 */
function Dot(a, b)
{
    return a[0] * b[0] + a[1] * b[1];
}

/**
 * @param int min
 * @param int max
 * @returns int
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{"../utils/create_subclass":6}],3:[function(require,module,exports){
'use strict';

var createSubClass = require('../../utils/create_subclass')
    , Container = createjs.Container
    , TOGGLE = 60
    , MAX_THRUST = 2
    , MAX_VELOCITY = 2;

module.exports = createSubClass(Container, 'AbstractCar', {
    initialize: AbstractCar$initialize,
    getContainer: AbstractCar$getContainer,
    rotate: AbstractCar$rotate,
    accelerate: AbstractCar$accelerate,
    getRotation: AbstractCar$getRotation,
    prepare: AbstractCar$prepare,
    tick: AbstractCar$tick
});

function AbstractCar$initialize() {
}

function AbstractCar$prepare(name, type, wheelCount, carcass, hitBox) {
    this.container = AbstractCar$getContainer.call(this);
    this.container.x = 0;
    this.container.y = 0;

    this.thrust = 0;
    this.vX = 0;
    this.vY = 0;

    // определям каркас
    var carcassObject;
    var carcassWidth = hitBox.x - 10;
    var carcassHeigh = hitBox.y;

    // колеса
    var wheelLF = createWheel(0,0,10,20,0,7);
    wheelLF.name = 'leftFrontWheel';
    this.container.addChild(wheelLF);
    var wheelRF = createWheel(0,0,10,20,carcassWidth,7);
    wheelRF.name = 'rightFrontWheel';
    this.container.addChild(wheelRF);
    var wheeLB = createWheel(0,0,13,23,-3,carcassHeigh - 25);
    this.container.addChild(wheeLB);
    var wheeRB = createWheel(0,0,13,23,carcassWidth,carcassHeigh - 25);
    this.container.addChild(wheeRB);

    switch (carcass) {
        // прямоугольный
        case 1 : {
            carcassObject = new createjs.Shape();
            carcassObject.graphics.beginStroke("#000");
            carcassObject.graphics.beginFill("#ccc");
            carcassObject.graphics.setStrokeStyle(1);
            carcassObject.graphics.drawRoundRect(0,0,carcassWidth,carcassHeigh, 3);
            carcassObject.x = 5;
            carcassObject.y = 0;
            carcassObject.setBounds(0,0,carcassWidth,carcassHeigh);
        }
            break;
        default : throw "Не известный каркас модели авто!";
            break;
    }
    this.container.addChild(carcassObject);
    this.container.regX = parseInt(hitBox.x/2);
    this.container.regY = parseInt(hitBox.y/2);

    this.container.setBounds(0,0,carcassWidth+10,carcassHeigh);
}

function AbstractCar$getContainer() {
    if (this.container == null) {
        this.container = new createjs.Container();
    }
    return this.container;
}

function AbstractCar$rotate(direction) {
    switch (direction) {
        // clockwise / по часовой стрелке
        case 1 : {
            if (this.container.getChildByName('leftFrontWheel').rotation < 10) {
                this.container.getChildByName('leftFrontWheel').rotation += 5;
                this.container.getChildByName('rightFrontWheel').rotation += 5;
            }
            this.container.rotation += 5;
        }
            break;
        // counterclockwise / против часовой стрелки
        case -1 : {
            if (this.container.getChildByName('leftFrontWheel').rotation > -10) {
                this.container.getChildByName('leftFrontWheel').rotation -= 5;
                this.container.getChildByName('rightFrontWheel').rotation -= 5;
            }
            this.container.rotation -= 5;
        }
            break;
    }
}

function AbstractCar$accelerate() {
    this.thrust += this.thrust + 1;
    if (this.thrust >= MAX_THRUST) {
        this.thrust = MAX_THRUST;
    }

    //accelerate
    this.vX += Math.sin(this.container.rotation * (Math.PI / -180));
    this.vY += Math.cos(this.container.rotation * (Math.PI / -180));
    //cap max speeds
    this.vX = Math.min(MAX_VELOCITY, this.vX);
    this.vY = Math.min(MAX_VELOCITY, this.vY);
}

function AbstractCar$getRotation() {
    return this.container.rotation;
}

function AbstractCar$tick() {
    //console.log("vX2: " + this.vX);
    //console.log("X: " + this.container.x);
    //console.log("R: " + this.container.rotation);

    if (this.thrust > 0) {
        this.container.x -= this.vX;
        this.container.y -= this.vY;
        this.thrust -= 0.5;
    } else {
        this.thrust = 0;
        //this.vX = 0;
        //this.vY = 0;
    }
}

function createWheel(sX,sY,eX,eY,posX,posY) {
    var wheel = new createjs.Shape();
    wheel.graphics.beginFill("#000");
    wheel.graphics.drawRoundRect(sX,sY,eX,eY, 3);
    wheel.x = posX;
    wheel.y = posY;
    return wheel;
}
},{"../../utils/create_subclass":6}],4:[function(require,module,exports){
'use strict';

var createSubClass = require('../../utils/create_subclass')
    , Container = createjs.Container
    , AbstractCar = require('./AbstractCar');

module.exports = createSubClass(AbstractCar, 'BasicCar', {
    initialize: BasicCar$initialize
});

function BasicCar$initialize() {
    AbstractCar.prototype.prepare.apply(this,['BasicCar', 'general', 4, 1, {x:40, y:70}]);
}
},{"../../utils/create_subclass":6,"./AbstractCar":3}],5:[function(require,module,exports){
'use strict';

var utils = require('./utils')
    , domReady = utils.domReady
    , World = require('./entity/World')
    , Hero = require('./entity/Hero');
var c = createjs,
    canvas,
    controls = {
      LEFT_KEYCODE: 65,
      RIGHT_KEYCODE: 68,
      FORWARD_KEYCODE: 87,
      HELD : {}
    },
    heroObj,
    worldObj;
console.log('Game started: EaselJS version: ' + c.EaselJS.version );

domReady(function() {
   canvas = document.getElementById('canvas');
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   var stage = new c.Stage(canvas);

   worldObj = new World(50, 50);
   stage.addChild(worldObj);

   heroObj = new Hero('Player', 1, 100, 100);
   var centerPos = getCenterForElement(heroObj.getBounds().width, heroObj.getBounds().height);
   heroObj.x = centerPos.x;
   heroObj.y = centerPos.y;
   stage.addChild(heroObj);

   c.Ticker.timingMode = c.Ticker.RAF;
   c.Ticker.setFPS(30);
   c.Ticker.addEventListener('tick', function() {
      if (typeof controls.HELD[controls.LEFT_KEYCODE] != typeof undefined
            && controls.HELD[controls.LEFT_KEYCODE]) {
         heroObj.getCar().rotate(-1);
      }
      if (typeof controls.HELD[controls.RIGHT_KEYCODE] != typeof undefined
          && controls.HELD[controls.RIGHT_KEYCODE]) {
         heroObj.getCar().rotate(1);
      }
      if (typeof controls.HELD[controls.FORWARD_KEYCODE] != typeof undefined
          && controls.HELD[controls.FORWARD_KEYCODE]) {
         heroObj.getCar().accelerate();
      }
      heroObj.getCar().tick();
      stage.update();
   });
   document.onkeydown = handleKeyDown;
   document.onkeyup = handleKeyUp;

   function getCenter() {
      return { x: parseInt(canvas.width/2), y: parseInt(canvas.height/2) }
   }

   function getCenterForElement(elementWidth, elementHeight) {
      var center = getCenter();
      return {
         x: center.x - parseInt(elementWidth/2),
         y: center.y - parseInt(elementHeight/2)
      }
   }

   function handleKeyDown(event) {
      switch(event.keyCode) {
         case controls.LEFT_KEYCODE:
            controls.HELD[controls.LEFT_KEYCODE] = true;
            return false;
         case controls.RIGHT_KEYCODE:
            controls.HELD[controls.RIGHT_KEYCODE] = true;
            return false;
         case controls.FORWARD_KEYCODE:
            controls.HELD[controls.FORWARD_KEYCODE] = true;
            return false;
      }
      //playerMovements.setDirection(heroObj.getRotation());
   }
   function handleKeyUp(event) {
      switch(event.keyCode) {
         case controls.LEFT_KEYCODE:
            controls.HELD[controls.LEFT_KEYCODE] = false;
            break;
         case controls.RIGHT_KEYCODE:
            controls.HELD[controls.RIGHT_KEYCODE] = false;
            break;
         case controls.FORWARD_KEYCODE:
            controls.HELD[controls.FORWARD_KEYCODE] = false;
            break;
      }
   }
});
},{"./entity/Hero":1,"./entity/World":2,"./utils":8}],6:[function(require,module,exports){
'use strict';

module.exports = createSubclass;

function createSubclass(Superclass, name, methods) {
    var Subclass;

    //Subclass = function () { this.initialize.apply(this, arguments) };
    eval('Subclass = function '
            + name +
            '(){ this.initialize.apply(this, arguments) }');
    Subclass.prototype = new Superclass();

    for (var key in methods) {
        if (methods.hasOwnProperty(key))
            Subclass.prototype[key] = methods[key];
    }

    return Subclass;
}

},{}],7:[function(require,module,exports){
'use strict';

module.exports = domReady;

function domReady(func) {
    var self = this
        , args = Array.prototype.slice.call(arguments, 1);
    if (isReady.call(this))
        return callFunc();
    else
        document.addEventListener('readystatechange', callFunc);

    function callFunc() {
        document.removeEventListener('readystatechange', callFunc);
        return func.apply(self, args);
    }
}

domReady.isReady = isReady;

function isReady() {
    var readyState = document.readyState;
    return readyState == 'loading' ? false : readyState;
}
},{}],8:[function(require,module,exports){
'use strict';

module.exports = {

    domReady: require('./dom_ready'),
    createSubclass: require('./create_subclass')

};
},{"./create_subclass":6,"./dom_ready":7}]},{},[5]);