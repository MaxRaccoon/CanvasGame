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