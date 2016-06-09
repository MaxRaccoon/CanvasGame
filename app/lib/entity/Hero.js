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