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