(function () {
    var FPS = 10;
    var WIDTH = 800;
    var HEIGHT = 577;
    var SIZE = Math.floor(WIDTH / 25);
    var GRIDW = Math.floor(WIDTH / SIZE) - 1;
    var GRIDH = Math.floor(HEIGHT / SIZE) - 1;
    var TAIL_INCREASE = 1;
    var INITIAL_TAIL_LENGTH = 5;
    var canvas = document.getElementById('c');
    var ctx = canvas.getContext('2d');

    var grid;
    var snake;
    var foodBlock;
    var gameLoopInterval;
    var isPaused = true;

    initGame();
    pauseGame();

    function initGame() {
        clearInterval(gameLoopInterval);
        canvas.setAttribute('width', WIDTH);
        canvas.setAttribute('height', HEIGHT);
        grid = new GameGrid(GRIDW, GRIDH);
        snake = new Snake(grid, INITIAL_TAIL_LENGTH, TAIL_INCREASE, SIZE);
        snake.setColor('#2ecc71');
        foodBlock = new FoodBlock(GRIDW, GRIDH, SIZE);
        addKeyListener();
        gameLoopInterval = setInterval(function () {
            if (!isPaused) {
                update(ctx);
                draw(ctx);
            }
        }, 1000/FPS);
    }

    // Center screen big text.
    function messageText(text) {
        ctx.font = "48px Impact";
        ctx.fillStyle = '#7f8c8d';
        var textWidth = ctx.measureText(text).width;
        var x = (WIDTH - textWidth) / 2, y = HEIGHT / 2 - 24;
        ctx.fillText(text, x, y);
    }

    // Center screen small text below big text.
    function messageTextSmall(text) {
        ctx.font = "24px Impact";
        ctx.fillStyle = '#95a5a6';
        var textWidth = ctx.measureText(text).width;
        var x = (WIDTH - textWidth) / 2, y = HEIGHT / 2 + 6;
        ctx.fillText(text, x, y);
    }

    function pauseGame() {
        isPaused = true;
        messageText("Press SPACE to play");
        messageTextSmall("ESC to pause at any time");
    }

    function resumeGame() {
        if (snake.gameOver()) {
            initGame();
        }
        isPaused = false;
    }

    function update(c) {
        snake.updateDirection();
        if (snake.hasEaten(foodBlock)) {
            grid.score.addScore(snake.tailLength);
            while (snake.collidesWith(foodBlock.x, foodBlock.y)) {
                foodBlock = new FoodBlock(GRIDW, GRIDH, SIZE);
            }
        }

        if (snake.gameOver()) {
            grid.score.saveScore();
            isPaused = true;
        }
    }

    function draw(c) {
        c.clearRect(0, 0, WIDTH, HEIGHT);
        snake.draw(c);
        foodBlock.draw(c);
        grid.draw(c);
        if (snake.gameOver()) {
            messageText('GAME OVER');
            messageTextSmall('press SPACE to reset');
        }
    }

    function addKeyListener() {
        document.onkeydown = function(e) {
            if (e.keyCode === 32) {
                resumeGame();
            }
            else if(isPaused) {
                return;
            }
            else if (e.keyCode === 27) {
                pauseGame();
            }

            // Arrow keys
            var directions = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            if (directions.hasOwnProperty(e.keyCode)) {
                snake.setDirection(directions[e.keyCode]);
            }
        };
    }
})();
