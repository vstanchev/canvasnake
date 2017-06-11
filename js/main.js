(function () {
    var FPS = 10;
    var WIDTH = 1024;
    var HEIGHT = 768;
    var SIZE = Math.floor(WIDTH / 25);
    var GRIDW = Math.floor(WIDTH / SIZE) - 1;
    var GRIDH = Math.floor(HEIGHT / SIZE) - 1;
    var TAIL_INCREASE = 5;
    var INITIAL_TAIL_LENGTH = 5;
    var canvas = document.getElementById('c');
    var ctx = canvas.getContext('2d');

    var grid;
    var snake;
    var snake2;
    var foodBlock;
    var gameLoopInterval;

    initGame();

    function initGame() {
        clearInterval(gameLoopInterval);
        canvas.setAttribute('width', WIDTH);
        canvas.setAttribute('height', HEIGHT);
        grid = new GameGrid(GRIDW, GRIDH);
        snake = new Snake(grid, INITIAL_TAIL_LENGTH, TAIL_INCREASE, SIZE);
        snake2 = new Snake(grid, INITIAL_TAIL_LENGTH, TAIL_INCREASE, SIZE);
        snake2.setColor('#aeae00');
        foodBlock = new FoodBlock(GRIDW, GRIDH, SIZE);
        addKeyListener();
        gameLoopInterval = setInterval(function () {
            update(ctx);
            draw(ctx);
        }, 1000/FPS);
    }

    function update(c) {
        snake.updateDirection();
        snake2.updateDirection();
        if (snake.hasEaten(foodBlock)) {
            grid.score.addScore(snake.tailLength);
            while (snake.collidesWith(foodBlock.x, foodBlock.y)) {
                foodBlock = new FoodBlock(GRIDW, GRIDH, SIZE);
            }
        }

        if (snake2.hasEaten(foodBlock)) {
            grid.score.addScore(snake2.tailLength);
            while (snake2.collidesWith(foodBlock.x, foodBlock.y)) {
                foodBlock = new FoodBlock(GRIDW, GRIDH, SIZE);
            }
        }

        if (snake.gameOver() || snake2.gameOver()) {
            alert('Game over');
            initGame();
        }
    }

    function draw(c) {
        c.clearRect(0, 0, WIDTH, HEIGHT);
        snake.draw(c);
        snake2.draw(c);
        foodBlock.draw(c);
        grid.draw(c);
    }

    function addKeyListener() {
        document.onkeydown = function(e) {
            // Arrow keys
            var directions = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            // WASD
            var directions2 = {
                65: 'left',
                87: 'up',
                68: 'right',
                83: 'down'
            };

            if (directions.hasOwnProperty(e.keyCode)) {
                snake.setDirection(directions[e.keyCode]);
            }
            else if (directions2.hasOwnProperty(e.keyCode)) {
                snake2.setDirection(directions2[e.keyCode]);
            }
            else if (e.keyCode === 27) {
                alert('pause');
            }
        };
    }
})();
