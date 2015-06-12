
//Parent Class to all pieces on the board
//This checks that any newly created piece has a valid position, if not moves it off the canvas
var Block = function (x, y) {
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

Block.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.crashChk();
};

Block.prototype.crashChk = function () {
    if (this.constructor === Enemy) {
        if (this.y == player.y) {
            //if ((this.x + 3) > (player.x + 18) && (this.x + 97) <= (player.x + 82)) {
            var enLeft = this.x + 3;
            var plLeft = player.x + 14;
            var enRight = this.x + 97;
            var plRight = player.x + 82;
            if ( enRight > plLeft && enLeft < plRight) {
                alert("Player Hit by Bug");
                player.death();
            };
        };
    };
};

function floorSelect () {
    return 63 + 83 * Math.floor(Math.random()*3);
};

// The Enemy Subclass
var Enemy = function() {
    this.level = player.level;
    this.speed = Math.random() * 40 + 30;
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

Enemy.prototype = new Block();


Enemy.prototype.update = function(dt) {
    if (this.y < 0) {
        this.y = floorSelect();
    };
    this.move(dt);
};

//This gives Players a Curve ball from enemy bugs.
//Bugs will now randomly appear on the 2nd Grass level when a player reachs level 4... No where is safe!
Enemy.prototype.surprise = function () {
    if (player.level > 5) {
        if ( Math.random() < 0.1 ) {
            this.y = 63 + 83 * 3;
        };
    };
};

Enemy.prototype.move = function (dt) {
    if (this.dir == -1) { //This resets bugs possition one it has moved so far off the board for enemies going left
        if (this.x < -151) {
            this.x = 555;
            this.y = floorSelect();
            this.surprise();
        };
        this.x -= player.level*this.speed*dt;
    } else {
        if (this.x > 555) { //This resets bugs possition one it has moved so far off the board for enemies going right
            this.x = -151;
            this.y = floorSelect();
            this.surprise();
        };
        this.x += player.level*this.speed*dt;

    };
};

var allEnemies = [];

function resetAllEnemies () { //Resets Enemies to the beginning number of 2
    for(var i = 0; i < 2; i++){
        var enemy = new Enemy();
        enemy.constructor = Enemy;
        allEnemies.push(enemy);
    };
};

//This is the Player class with the neccisary requirements
var Player = function () {

    this.level = 1;
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.Topscore = 0;
};


Player.prototype = new Block(202, 63+83*4);

Player.prototype.update = function(dt) {
    
};

Player.prototype.handleInput = function (input) {
    //This is checks that the player is alive. If he is, then he can move.
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

Player.prototype.death = function () {
    this.lives --;
    alert("Player lives remaining: " + this.lives);
    player.x = 202;
    player.y = 63+83*4;
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
player.constructor = Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        83: 's'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
