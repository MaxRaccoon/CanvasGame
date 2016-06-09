MainCarEntity = function (options) {

    CarEntity.call(this);
    this.prototype = Object.create(CarEntity.prototype);
    MainCarEntity.prototype.constructor = MainCarEntity;

    this.prototype.type = 'general';
    this.prototype.wheelCount = 4;
    this.prototype.carcass = 1;
    this.prototype.hitBox = {x:40, y:70};

    MainCarEntity.prototype.init = function (options) {
    }
};