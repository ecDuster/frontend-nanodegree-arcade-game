//
var pImg = 'images/char-boy.png';

var block = function (x, y) {
    this.width = 101;
    this.height = 171;
    if ( x || x === 0 ) {
        this.x = x;
    } else {
        this.x = -101;
    }
    if ( y || y === 0 ) {
        this.y = y;
    } else {
        this.y = -171;
    };
};

block.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(level) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.level = level;
    this.speed = '0';
    this.dir = '1';
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = new block();
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    //This Creates the Player
    
    this.level = 1;
    this.sprite = pImg;
};

Player.prototype = new block(202, 171*5);

Player.prototype.update = function(dt) {
    
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3), new Enemy(3), new Enemy(4)];

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var xyz = document.getElementById('tester');
xyz.innerHTML = "<h2>Wow this actually worked</h2>";