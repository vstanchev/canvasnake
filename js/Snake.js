function GameGrid(width, height) {
    this.width = width;
    this.height = height;
    this.score = new Score();
}

GameGrid.prototype.draw = function(c) {
    this.score.draw(c);
};

function SnakeBlock(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = '#aaa';
}

SnakeBlock.prototype.draw = function (c) {
    var x = this.x * this.size, y = this.y * this.size;
    c.fillStyle = this.color;
    c.fillRect(x, y, this.size, this.size);
    c.strokeStyle = '#fff';
    c.lineWidth = 3;
    c.strokeRect(x, y, this.size, this.size);
};

function Snake(gameGrid, length, increaseRate, blockSize) {
    this.gameGrid = gameGrid;
    this.increaseRate = increaseRate;
    this.tailLength = length;
    this.direction = 'right';
    this.directionQueue = [];
    this.tail = [];
    this.color = '#aaa';
    var randY = Math.floor(Math.random() * gameGrid.height);
    for (var i = this.tailLength - 1; i >= 0; --i) {
        var newBlock = new SnakeBlock(i, randY, blockSize);
        this.tail.push(newBlock);
    }
}

Snake.prototype.setColor = function(color) {
    this.color = color;
    for(var i = 0; i < this.tailLength; ++i) {
        this.tail[i].color = color;
    }
};

Snake.prototype.updateDirection = function() {
    if (this.directionQueue.length) {
        this.direction = this.directionQueue.shift();
    }

    var headX = this.tail[0].x;
    var headY = this.tail[0].y;
    var tail = this.tail.pop();

    switch (this.direction) {
        case 'left':
            headX--;
            break;
        case 'up':
            headY--;
            break;
        case 'right':
            headX++;
            break;
        case 'down':
            headY++;
            break;
    }

    tail.x = headX;
    tail.y = headY;
    if (tail.x > this.gameGrid.width)  tail.x = 0;
    if (tail.y > this.gameGrid.height) tail.y = 0;
    if (tail.x < 0) tail.x = this.gameGrid.width;
    if (tail.y < 0) tail.y = this.gameGrid.height;
    this.tail.unshift(tail);
};

Snake.prototype.draw = function (c) {
    for (var i = 0; i < this.tailLength; ++i) {
        this.tail[i].draw(c);
    }
};

Snake.prototype.setDirection = function(direction) {
    var lastDirection = this.direction;

    if (this.directionQueue.length) {
        lastDirection = this.directionQueue[this.directionQueue.length - 1];
    }

    // Prevent setting same or opposite direction.
    if (lastDirection !== direction
        && lastDirection !== this.getOppositeDirection(direction)) {

        this.directionQueue.push(direction);
    }
};

Snake.prototype.getOppositeDirection = function(direction) {
    switch (direction) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'up':
            return 'down';
        case 'down':
            return 'up';
    }
};

Snake.prototype.gameOver = function() {
    // Check if the head is at the same place as another block.
    var head = this.tail[0];
    for (var i = 1; i < this.tailLength; ++i) {
        if (head.x === this.tail[i].x
            && head.y === this.tail[i].y) {

            return true;
        }
    }
};

Snake.prototype.increaseTail = function(n) {
    this.tailLength += n;
    var lastBlock = this.tail[this.tail.length - 1];
    while (n) {
        var newBlock = new SnakeBlock(lastBlock.x, lastBlock.y, lastBlock.size);
        newBlock.color = this.color;
        this.tail.push(newBlock);
        --n;
    }
};

Snake.prototype.hasEaten = function(food) {
    if (this.tail[0].x === food.x
        && this.tail[0].y === food.y) {

        this.increaseTail(this.increaseRate);
        return true;
    }
    return false;
};

Snake.prototype.collidesWith = function(x, y) {
    for (var i = 0; i < this.tailLength; ++i) {
        if (this.tail[i].x === x && this.tail[i].y === y) {
            return true;
        }
    }
    return false;
};

function FoodBlock(maxX, maxY, size) {
    this.x = Math.floor(Math.random() * maxX);
    this.y = Math.floor(Math.random() * maxY);
    this.size = size;
}

FoodBlock.prototype.draw = function(c) {
    var x = this.x * this.size, y = this.y * this.size;
    c.fillStyle = '#7aff82';
    c.fillRect(x, y, this.size, this.size);
};

function Score() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.x = 15;
    this.y = 50;
}

Score.prototype.addScore = function(score) {
    this.score += score;
};

Score.prototype.saveScore = function() {
    if (this.score > this.highScore) {
        localStorage.setItem('snakeHighScore', this.score);
    }
};

Score.prototype.loadHighScore = function() {
    this.highScore = localStorage.getItem('snakeHighScore');
};

Score.prototype.draw = function(c) {
    var text = "SCORE " + this.score;
    c.font = "40px Impact";
    c.fillStyle = '#eee';
    c.fillText(text, this.x, this.y);
    c.strokeStyle = '#000';
    c.lineWidth = 1;
    c.strokeText(text, this.x, this.y);
};
