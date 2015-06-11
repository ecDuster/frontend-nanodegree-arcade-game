
//Parent Class to all pieces on the board
//This checks that any newly created piece has a valid position, if not moves it off the canvas
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

function floorSelect () {
    return 63 + 83 * Math.floor(Math.random()*3);
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.level = player.level;
    this.speed = Math.random() * 70 + 20;
    if (Math.random() < 0.4) {
        this.dir = -1;
    } else {
        this.dir = 1;
    };
    if (this.dir == -1) {
        this.sprite = 'images/enemy-bug-rev.png';
    } else {
        this.sprite = 'images/enemy-bug.png';
    };
};

Enemy.prototype = new block();
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.y < 0) {
        this.y = floorSelect();
    };
    this.move(dt);
};

//This gives Players a Curve ball from enemy bugs.
//Bugs will now randomly appear on the 2nd Grass level... No where is safe!
Enemy.prototype.surprise = function () {
    if (player.level > 4) {
        if ( Math.random() < 0.1 ) {
            this.y = 63 + 83 * 3;
        };
    };
};

Enemy.prototype.move = function (dt) {
    if (this.dir == -1) {
        if (this.x < -151) {
            this.x = 555;
            this.y = floorSelect();
            this.surprise();
        };
        this.x -= player.level*this.speed*dt;
    } else {
        if (this.x > 555) {
            this.x = -151;
            this.y = floorSelect();
            this.surprise();
        };
        this.x += player.level*this.speed*dt;
        
    };
};
// Draw the enemy on the screen, required method for game

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {

    this.level = 1;
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.Topscore = 0;
};


Player.prototype = new block(202, 63+83*4);

Player.prototype.update = function(dt) {

};

Player.prototype.handleInput = function (input) {
    if (player.lives > 0) {
        switch(input) {
            case "left":
                if (this.x > 100) {
                    this.x -= 101;
                };
                break;
            case "right":
                if (this.x < 404) {
                    this.x += 101;
                };
                break;
            case "up":
                if (this.y > 62) {
                    this.y -= 83;
                };
                break;
            case "down":
                if (this.y < 395) {
                    this.y += 83;
                };
                break;
            case "s":
                this.level = prompt("Set Player Level. (Must use a number)");
                break;
            default:
                break;
        };
    };
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        83: 's'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
