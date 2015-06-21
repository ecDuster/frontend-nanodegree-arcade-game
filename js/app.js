/*****************************************************************
                          Block Parent CLASS
This sets the basic starting point for all pieces

This checks that any newly created piece has a valid position
        ~if not moves it off the canvas

******************************************************************/

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
    if (this.constructor === Player) {
    };
    if (this.constructor === Enemy) {
        if (player.gameOver === true) {
            ctx.drawImage(Resources.get(player.imgGameOver), 55, 63+83+30);
        } else if (player.dead === true && player.y < 62) {
            ctx.drawImage(Resources.get(player.imgDrown), 55, 63+83+30);
        } else if (player.dead === true && player.y > 62) {
            ctx.drawImage(Resources.get(player.imgEaten), 55, 63+83+30);
        };
    };

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
    if (this.constructor === Item) {
        if (this.y == player.y) {//CHECKS TO SEE IS PLAYER LANDED ON ITEM
            if (this.x + 97 > player.x + 16 && this.x + 4 < player.x + 82) {
                if (this.id == "orange" || this.id == "green" || this.id == "blue") {
                    player.score += this.score;
                    this.show = false;
                };
            };
        };
        allGems.forEach(function (gem) {
            if (this.x + 97 >= gem.x + 16 && this.x + 4 <= gem.x + 82) {
                this.show = false;
            };
        });
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
        this.sprite = "images/enemy-bug-rev.png";
    } else {
        this.sprite = "images/enemy-bug.png";
    };
};

Enemy.prototype = new Block();

Enemy.prototype.update = function(dt) {
    if (this.y < 0) {
        this.y = floorSelect();
    };
    this.move(dt);
    this.level = Math.floor(player.level/2);
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
        this.x -= this.level*this.speed*dt;
    } else {
        if (this.x > 555) { //RESETS BUG POSITION TO START FOR BUGS GOING RIGHT
            this.x = -151;
            this.y = floorSelect();
            this.surprise();
        };
        this.x += this.level*this.speed*dt;
    };
};

/*****************************************************************
                          PLAYER CLASS
   This sets the basic starting point for values of each player

level - Players Current level (Game gets harder with high level)
time  - keep track of game time & how long a players been dead
sprite - the image thats drawn for each player
oldSprite - Reset Player image back from the Skull & Cross bones
dead - boolean value of if player is dead or not
gameOver - bollean value if the player is out of lives
score - the name explains itself
topScore - .... no you don't get an explanation

******************************************************************/

var Player = function () {
    this.level = 1;
    this.levelUS = 100// SETS THE MULTIPLIER TO POINTS REQUIRED TO LEVEL UP
    this.time = 0;
    this.timeDead = 0;
    this.lives = 3;
    this.sprite = "images/char-boy.png";
    this.oldSprite = this.sprite;
    this.dead = false;
    this.score = 0;
    this.topScore = 0;
    this.gameOver = false;
};

Player.prototype = new Block(202, 63+83*4);

Player.prototype.update = function(dt) {
    if (this.dead) { //CHECKS TO SEE IF PLAYER DIED
        this.sprite = "images/skull-cartoon.png";
        this.timeDead += dt;
        if (this.timeDead > 3) {
            this.reset();
        };
    };
    if (this.lives === 0) { //CHECKS IF PLAYER HAS LOST ALL LIVES
        this.gameOver = true;
    };
    if (this.gameOver) {
        this.sprite = "images/skull-cartoon.png";
    };
    if (this.score > this.topScore) { //CHECKS IF NEW HIGH SCORE REACHED
        this.topScore = this.score;
    };
    this.levelUp(dt); //CHECKS FOR NEED OF PLAYER LEVEL UP
};

Player.prototype.levelUp = function (dt) {//LEVELS PLAYER UP
    if (this.score > this.levelUS * this.level) {//CHECKS IF PLAYERS POINTS HAVE REACHED NEXT LEVEL
        this.level ++
        if (this.level % 2 == 0) {
            if (allEnemies.length < 6) {
                allEnemies.push(new Enemy());
                allEnemies[allEnemies.length - 1].constructor = Enemy;
            };
        };
        if (allGems.length < 10) {
            if (Math.random() < 0.2) {
                addItem("blue");
            } else if (Math.random() < 0.4) {
                addItem("green");
            } else if (Math.random() < 0.7) {
                addItem("orange");
            };
        };
    };
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
        resetAllItems();
    };
};

Player.prototype.plSelect = function () {

};

/*****************************************************************
                      EXTRA ITEMS CLASS
MUST SET WHAT THE ITEM IS TO USE 'ITEMS' CLASS

Select a Item:
   "orange" - Orange Gem: Worth 10 points
   "green" - Green Gem: Worth 25 points
   "blue" - Blue Gem: Worth 80 points
   "heart" - Gives people a life
   "star" - Makes player invulnerable
   "rock" - Creates a rock

******************************************************************/
var Item = function (item) {
    switch (item) {
        case "orange":
            this.id = item;
            this.score = 10;
            this.sprite = "images/Gem Orange.png";
            this.tTime = 13;
            this.chance = 0.7; //70% CHANCE OF THIS PIECE SHOWING
            break;
        case "green":
            this.id = item;
            this.score = 40;
            this.sprite = "images/Gem Green.png";
            this.tTime = 10;
            this.chance = 0.4; //40% CHANCE OF THIS PIECE SHOWING
            break;
        case "blue":
            this.id = item;
            this.score = 80;
            this.sprite = "images/Gem Blue.png";
            this.tTime = 7;
            this.chance = 0.2; //20% CHANCE OF THIS PIECE SHOWING
            break;
        case "heart":
            this.id = item;
            break;
        case "star":
            this.id = item;
            break;
        case "rock":
            this.id = item;
            break;
        default:
            break;
    };
    this.show = false;
    this.sTime = 0;
    this.holdTime = 0;
};

Item.prototype = new Block();

Item.prototype.update = function (dt) {
    if (!this.show && Math.random() < this.chance && this.holdTime > 1 * player.level) {
        this.show = true;
        this.holdTime = 0;
        this.move();
    } else if (!this.show) {
        this.holdTime += dt;
        this.x = -101;
        this.y = -171;
    };
    if (this.show && this.sTime > this.tTime) {
        this.show = false;
        this.x = -101;
        this.y = -171;
        this.sTime = 0;
    } else if (this.show) {
        this.sTime += dt;
    };
};

Item.prototype.move = function () {//DETECTS IF THERES A FREE SPOT AND MOVES THE GEM TO IT
    var x = 101 * Math.floor(Math.random() * 5);
    var y = 63 + 83 * Math.floor(Math.random() * 3);
    var noMatch = 0;
    allGems.forEach(function (gem) {
        if (gem.x != x && gem.y != y) {
            noMatch ++;
        }
    });
    if (allGems.length == noMatch) {
        this.x = x;
        this.y = y;
    };
};

/*****************************************************************
                      CUSTOM FUNCTIONS

******************************************************************/

function resetAllItems () { //RESET ENEMYS ANG GEMS TO BEGINNING NUM
    allEnemies = [];
    allGems = [];
    for (var i = 0; i < 2; i++) {
        addItem("orange");
    };
    player.dead = false;
    player.lives = 3;
    player.level = 1;
    player.score = 0;
    player.sprite = "images/char-boy.png";
    player.gameOver = false;
    player.spriteChar2 = "images/char-pink-girl.png";
    player.spriteDead = "images/skull-cartoon.png";
    player.spriteChar3 = "images/char-cat-girl.png";
    player.spriteChar4 = "images/char-princess-girl.png";
    player.spriteChar5 = "images/char-horn-girl.png";
    player.imgGameOver = "images/game-over.png";
    player.imgEaten = "images/eaten.png";
    player.imgDrown = "images/drowned.png";
};

function addItem (item) {
     switch (item) {
        case "orange":
            allGems.push(new Item ("orange"));
            allGems[allGems.length - 1].constructor = Item;
            break;
        case "green":
            allGems.push(new Item("green"));
            allGems[allGems.length - 1].constructor = Item;
            break;
        case "blue":
            allGems.push(new Item("blue"));
            allGems[allGems.length - 1].constructor = Item;
            break;
        case "heart":

            break;
        case "star":

            break;
        case "rock":

            break;
        default:
            break;
     };
};
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keydown", function(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        83: "s",
        68: "d"
    };
    //alert(e.keyCode);
    player.handleInput(allowedKeys[e.keyCode]);
});


/*****************************************************************
                      GAME START PROPERTIES

******************************************************************/
var allGems = [];
var allEnemies = [];
var player = new Player();
player.constructor = Player;
