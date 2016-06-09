CarEntity = function () {

    this.container = null;
    this.isMoving = false;

    CarEntity.prototype.type;
    CarEntity.prototype.wheelCount;
    CarEntity.prototype.carcass;
    CarEntity.prototype.hitBox;

    CarEntity.prototype.init = function (options) {

    }

    CarEntity.prototype.prepareModel = function (container) {

        container.x = 0;
        container.y = 0;

        // определям каркас
        var carcass;
        var carcassWidth = this.hitBox.x - 10;
        var carcassHeight = this.hitBox.y;

        // колеса
        var wheelLF = createWheel(0,0,10,20,0,7);
        wheelLF.name = 'leftFrontWheel';
        container.addChild(wheelLF);
        var wheelRF = createWheel(0,0,10,20,carcassWidth,7);
        wheelRF.name = 'rightFrontWheel';
        container.addChild(wheelRF);
        var wheeLB = createWheel(0,0,13,23,-3,carcassHeight - 25);
        container.addChild(wheeLB);
        var wheeRB = createWheel(0,0,13,23,carcassWidth,carcassHeight - 25);
        container.addChild(wheeRB);

        switch (this.carcass) {
            // прямоугольный
            case 1 : {
                carcass = new createjs.Shape();
                carcass.graphics.beginStroke("#000");
                carcass.graphics.beginFill("#ccc");
                carcass.graphics.setStrokeStyle(1);
                carcass.graphics.drawRoundRect(0,0,carcassWidth,carcassHeight, 3);
                carcass.x = 5;
                carcass.y = 0;
                carcass.setBounds(0,0,carcassWidth,carcassHeight);
            }
                break;
            default : throw "Не известный каркас модели авто!";
                break;
        }
        container.addChild(carcass);
        container.regX = parseInt(this.hitBox.x/2);
        container.regY = parseInt(this.hitBox.y/2);

        container.setBounds(0,0,carcassWidth+10,carcassHeight);
        this.container = container;
        return container;
    }

    CarEntity.prototype.getContainer = function () {
        if (this.container == null) {
            this.container = new createjs.Container();
        }
        return this.container;
    }

    CarEntity.prototype.rotate = function(direction) {
        switch (direction) {
            // clockwise / по часовой стрелке
            case 1 : {
                if (this.container.getChildByName('leftFrontWheel').rotation < 10) {
                    this.container.getChildByName('leftFrontWheel').rotation += 5;
                    this.container.getChildByName('rightFrontWheel').rotation += 5;
                }
                console.log(this.isMoving);
                if (this.isMoving) this.container.rotation += 5;
            }
                break;
            // counterclockwise / против часовой стрелки
            case -1 : {
                if (this.container.getChildByName('leftFrontWheel').rotation > -10) {
                    this.container.getChildByName('leftFrontWheel').rotation -= 5;
                    this.container.getChildByName('rightFrontWheel').rotation -= 5;
                }
                console.log(this.isMoving);
                if (this.isMoving) this.container.rotation -= 5;
            }
                break;
        }
    }

    CarEntity.prototype.getRotation = function() {
        return this.container.rotation;
    }

    createWheel = function(sX,sY,eX,eY,posX,posY) {
        var wheel = new createjs.Shape();
        wheel.graphics.beginFill("#000");
        wheel.graphics.drawRoundRect(sX,sY,eX,eY, 3);
        wheel.x = posX;
        wheel.y = posY;
        return wheel;
    }
};