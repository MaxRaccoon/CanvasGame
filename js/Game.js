Game = function(canvasId, loader) {

    var loader = loader;
    var controls = {
        LEFT_KEYCODE: 65,
        RIGHT_KEYCODE: 68
    }
    var playerMovements;
    var canvas;
    var playerCar;
    var stage;

    Game.prototype.init = function() {

        canvas = document.getElementById(canvasId);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stage = new createjs.Stage(canvas);

        ground = new createjs.Shape();
        ground.graphics.beginBitmapFill(this.loader.getResult("ground")).drawRect(0, 0, stage.canvas.width, stage.canvas.height);
        stage.addChild(ground);

        var car = new CarEntity();
        playerCar = new MainCarEntity({});
        playerCar.init({});

        container = playerCar.prototype.getContainer();
        stage.addChild(container);
        playerCar.prototype.prepareModel(container);
        var centerPos = getCenterForElement(container.getBounds().width, container.getBounds().height);
        container.x = centerPos.x;
        container.y = centerPos.y;
        stage.update();

        createjs.Ticker.setFPS(100);
        createjs.Ticker.addEventListener("tick", onTick);
        document.onkeydown = keyPressed;

        playerMovements = new Movements();
    }

    function getCenter() {
        return { x: parseInt(this.canvas.width/2), y: parseInt(this.canvas.height/2) }
    }

    function getCenterForElement(elementWidth, elementHeight) {
        var center = getCenter();
        return {
            x: center.x - parseInt(elementWidth/2),
            y: center.y - parseInt(elementHeight/2)
        }
    }

    function onTick(event) {
        stage.update();
    }

    function keyPressed(event) {
        switch(event.keyCode) {
            case controls.LEFT_KEYCODE:
                playerCar.prototype.rotate(-1);
                break;
            case controls.RIGHT_KEYCODE:
                playerCar.prototype.rotate(1);
                break;
        }
        playerMovements.setDirection(playerCar.prototype.getRotation());
    }

}
