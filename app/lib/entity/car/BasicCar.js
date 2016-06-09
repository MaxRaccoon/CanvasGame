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