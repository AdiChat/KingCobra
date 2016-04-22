/*The MIT License (MIT)

Copyright (c) 2015 Aditya Chatterjee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var Game      = Game      || {};
var Keyboard  = Keyboard  || {}; 
var Component = Component || {};
Keyboard.Keymap = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};
Keyboard.ControllerEvents = function() {
        var self      = this;
        this.pressKey = null;
        this.keymap   = Keyboard.Keymap;
        document.onkeydown = function(event) {
          self.pressKey = event.which;
        };
        // Copyright (c) 2015 Aditya Chatterjee
        this.getKey = function() {
          return this.keymap[this.pressKey];
        };
};
        // Copyright (c) 2015 Aditya Chatterjee
Component.Stage = function(canvas, conf) {  
      this.keyEvent  = new Keyboard.ControllerEvents();
      this.width     = canvas.width;
      this.height    = canvas.height;
      this.length    = [];
      this.food      = {};
      this.score     = 0;
      this.direction = 'right';
      this.conf      = {
            cw   : 10,
            size : 5,
            fps  : 1000
      };
     
      if (typeof conf == 'object') {
        for (var key in conf) {
          if (conf.hasOwnProperty(key)) {
            this.conf[key] = conf[key];
          }
        }
      }
};
Component.Snake = function(canvas, conf) {
          this.stage = new Component.Stage(canvas, conf);
          // Copyright (c) 2015 Aditya Chatterjee

          // Initial Snake
          this.initSnake = function() {
            
                  // Iteration in Snake Conf Size
                  for (var i = 0; i < this.stage.conf.size; i++) {
                    
                    // Add Snake Cells
                    this.stage.length.push({x: i, y:0});
              		}
        	};
          
          // Call initial Snake
          this.initSnake();
          
          // Initial Food  
          this.initFood = function() {
              		// Copyright (c) 2015 Aditya Chatterjee

                  // Add food on stage
                  this.stage.food = {
              			x: Math.round(Math.random() * (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw), 
              			y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw), 
              		};
        	};
          
          // Initial Food
          this.initFood();
          
          // Restart Stage
          this.restart = function() {
            this.stage.length            = [];
            this.stage.food              = {};
            this.stage.score             = 0;
            this.stage.direction         = 'right';
            this.stage.keyEvent.pressKey = null;
            this.initSnake();
            this.initFood();
          };
};
Game.Draw = function(context, snake) {
              this.drawStage = function() {
                      var keyPress = snake.stage.keyEvent.getKey(); 
                      if (typeof(keyPress) != 'undefined') {
                        snake.stage.direction = keyPress;
                      }
                  		context.fillStyle = "white";
                  		context.fillRect(0, 0, snake.stage.width, snake.stage.height);
                      var nx = snake.stage.length[0].x;
                  		var ny = snake.stage.length[0].y;
                      switch (snake.stage.direction) {
                        case 'right':
                          nx++;
                          break;
                        case 'left':
                          nx--;
                          break;
                        case 'up':
                          ny--;
                          break;
                        case 'down':
                          ny++;
                          break;
                      }
                      if (this.collision(nx, ny) == true) {
                        snake.restart();
                        return;
                      }
                      if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
                        var tail = {x: nx, y: ny};
                        snake.stage.score++;
                        snake.initFood();
                      } else {
                        var tail = snake.stage.length.pop();
                        tail.x   = nx;
                        tail.y   = ny;	
                      }
                      snake.stage.length.unshift(tail);
                      for (var i = 0; i < snake.stage.length.length; i++) {
                        var cell = snake.stage.length[i];
                        this.drawCell(cell.x, cell.y);
                      }
                      this.drawCell(snake.stage.food.x, snake.stage.food.y);
                      context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height - 5));
            };
            this.drawCell = function(x, y) {
                    context.fillStyle = 'rgb(170, 170, 170)';
                    context.beginPath();
                    context.arc((x * snake.stage.conf.cw + 6), (y * snake.stage.conf.cw + 6), 4, 0, 2*Math.PI, false);    
                    context.fill();
            };
            // Copyright (c) 2015 Aditya Chatterjee
            this.collision = function(nx, ny) {  
                    if (nx == -1 || nx == (snake.stage.width / snake.stage.conf.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.conf.cw)) {
                      return true;
                    }
                    return false;    
          	}
};
Game.Snake = function(elementId, conf) {
        var canvas   = document.getElementById(elementId);
        var context  = canvas.getContext("2d"); // returns an object that can be used to draw lines , circles , etc
        var cobra    = new Component.Snake(canvas, conf);var gameDraw = new Game.Draw(context, snake);
        setInterval(function() {gameDraw.drawStage();}, cobra.stage.conf.fps);
};

window.onload = function() {
  var snake = new Game.Snake('stage', {fps: 200, size: 5});
};
