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
