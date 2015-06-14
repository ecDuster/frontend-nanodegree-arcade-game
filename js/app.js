/*****************************************************************
                          Block Parent CLASS
This sets the basic starting point for all pieces

This checks that any newly created piece has a valid position
        ~if not moves it off the canvas
******************************************************************/
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
    this.crashChk(); //You need to check crashes after the image is drawn. This is because from a players point of view they wouldn't have been hit by the object yet.
};

Block.prototype.crashChk = function () {
    if (this.constructor === Enemy) {
        if (this.y == player.y) {
            if (this.x + 97 > player.x + 16 && this.x + 4 < player.x + 82 && !player.dead) {
                player.death();
            };
        };
    };
    if (this.constructor === Player) {
        if (!this.dead) {
            if (this.y < -19) {
                this.death();
            };
        };
    };
};

function floorSelect () {
    return 63 + 83 * Math.floor(Math.random()*3);
};

/*****************************************************************
                         ENEMY CLASS

This sets the basic starting point for each player

******************************************************************/
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

//GIVES PLAYERS A CURVE BALL AT LEVEL 5
//TRY THE GAME TO SEE IF YOU CAN SURVIVE IT!
Enemy.prototype.surprise = function () {
    if (player.level > 5) {
        if ( Math.random() < 0.1 ) {
            this.y = 63 + 83 * 3;
        };
    };
};

Enemy.prototype.move = function (dt) {
    if (this.dir == -1) {//RESETS BUG POSITION TO START FOR BUGS GOING LEFT
        if (this.x < -151) {
            this.x = 555;
            this.y = floorSelect();
            this.surprise();
        };
        this.x -= player.level*this.speed*dt;
    } else {
        if (this.x > 555) { //RESETS BUG POSITION TO START FOR BUGS GOING RIGHT
            this.x = -151;
            this.y = floorSelect();
            this.surprise();
        };
        this.x += player.level*this.speed*dt;
    };
};

function resetAllEnemies () { //RESET ENEMYS to BEGINNING NUM OF 2
    for(var i = 0; i < 2; i++){
        var enemy = new Enemy();
        enemy.constructor = Enemy;
        allEnemies.push(enemy);
    };
};

/*****************************************************************
                          PLAYER CLASS
   This sets the basic starting point for values of each player

level - Players Current level (Game gets harder with high level)
time  - keep track of game time & how long a players been dead
sprite - the image thats drawn for each player
dead - boolean value of if player is dead or not
score - the name explains itself
topScore - .... no you don't get an explanation
******************************************************************/
var Player = function () {
    this.level = 1;
    this.time = 0;
    this.timeDead = 0;
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.oldSprite = this.sprite;
    this.dead = false;
    this.score = 0;
    this.topScore = 0;
};


Player.prototype = new Block(202, 63+83*4);

Player.prototype.update = function(dt) {
    if (this.dead) { //CHECKS TO SEE IF PLAYER DIED
        this.sprite = "images/skull-cartoon.png";
        this.timeDead += dt;
        if (this.timeDead > 1) {
            this.reset();
        };
    } else if (this.dead && this.lives === 0) {
        this.sprite = "images/skull-cartoon.png";
    }
};



Player.prototype.reset = function () {
    this.x = 202;
    this.y = 63+83*4;
    this.sprite = this.oldSprite;
    this.timeDead = 0;
    this.dead = false;
};

Player.prototype.death = function () {
    this.lives --;
    this.dead = true;
};

Player.prototype.handleInput = function (input) {
    //This is checks that the player is alive. If he is, then he can move.
    if (this.lives > 0 && !this.dead) {
        switch(input) {
            case "left":
                if (this.x > 100) {
                    this.x.last = this.x;
                    this.x -= 101;
                };
                break;
            case "right":
                if (this.x < 404) {
                    this.x.last = this.x;
                    this.x += 101;
                };
                break;
            case "up":
                if (this.y > 62) {
                    this.y.last = this.y;
                    this.y -= 83;
                };
                break;
            case "down":
                if (this.y < 395) {
                    this.y.last = this.y;
                    this.y += 83;
                };
                break;
            default:
                break;
        };
    };
    if (input == "s") {
        this.level = prompt("Set Player Level. (Must use a number)");
        this.lives = prompt("Set Player Lives. (Must use a number)");
    };
    if (input == "d") {
        this.reset();
    };
};

/*****************************************************************
                      GAME START PROPERTIES

******************************************************************/
var allEnemies = [];
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
        83: 's',
        68: 'd'
    };
    //alert(e.keyCode);
    player.handleInput(allowedKeys[e.keyCode]);
});
