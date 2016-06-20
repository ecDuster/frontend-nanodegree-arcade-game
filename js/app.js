/*****************************************************************

                          BLOCK CLASS (PARENT)

This sets the basic starting point for all pieces

This checks that any newly created piece has a valid position
        ~if not moves it off the canvas

******************************************************************/
"use strict";
var Block = function(x, y) {
    if (x) {
        this.x = x;
    } else {
        this.x = -101;
    }
    if (y) {
        this.y = y;
    } else {
        this.y = -171;
    }
};

//THIS RENDER FUNCTION ENSURES EVERY PIECE ON THE BOARD IS DRAWN, IT IS CALLED BY ALL CLASS TYPES
Block.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.crashChk(); //Need to check crashes after the image is drawn. This is because from a players point of view they wouldn't have been hit by the object yet.
    if (this.constructor === Player) {
        this.scoreBoard();
    }
    if (player.gameOver === true) {
        ctx.drawImage(Resources.get(player.imgGameOver), 55, 63+83+30);
    } else if (player.dead === true && player.y < 63) {
        ctx.drawImage(Resources.get(player.imgDrown), 55, 63+83+30);
    } else if (player.dead === true && player.y > 62) {
        ctx.drawImage(Resources.get(player.imgEaten), 55, 63+83+30);
    } else if (player.playerSelect) {
        player.plSelect();
    }

};

//THIS CHECK TO SEE IF A PLAYER CRASHED INTO ANY OBJECT
Block.prototype.crashChk = function() {
    if (this.constructor === Enemy) {
        if (this.y == player.y) {
            if (this.x + 97 > player.x + 16 && this.x + 4 < player.x + 82 && !player.dead) {
                player.death();
            }
        }
    }
    if (this.constructor === Player) {
        if (!this.dead) {
            if (this.y < 62) {
                player.death();
            }
        }
    }
    if (this.constructor === Item) {
        if (this.y == player.y) {//CHECKS TO SEE IS PLAYER LANDED ON ITEM
            if (this.x + 97 > player.x + 16 && this.x + 4 < player.x + 82) {
                if (this.id == 'orange' || this.id == 'green' || this.id == 'blue') {
                    player.score += this.score;
                    this.show = false;
                    gemSound.play();
                }
                if (this.id == 'heart') {
                    player.lives++;
                    this.show = false;
                    hrtSound.play();
                }
            }
        }
    }
};



/*****************************************************************

                         ENEMY CLASS (CHILD)

This sets the basic starting point for each player

******************************************************************/

var Enemy = function() {
    this.level = player.level;
    this.speed = Math.random() * 40 + 30;
    if (Math.random() < 0.4) {
        this.dir = -1;
    } else {
        this.dir = 1;
    }
    if (this.dir == -1) {
        this.sprite = 'images/enemy-bug-rev.png';
    } else {
        this.sprite = 'images/enemy-bug.png';
    }
};

//THIS ALLOWS ENEMY CLASS ACCESS TO BLOCK PARENT CLASS PROTOTYPES
Enemy.prototype = new Block();
Enemy.prototype.constructor = Enemy;

//THIS UPDATES THE ENEMIES MOVEMENTS WITHIN THE GAME
Enemy.prototype.update = function (dt) {
    if (this.y < 0) {
        this.y = floorSelect();
    }
    this.move(dt);
    this.level = player.level/1.5;
};

//GIVES PLAYERS A CURVE BALL AT LEVEL 5
//TRY THE GAME TO SEE IF YOU CAN SURVIVE IT!
Enemy.prototype.surprise = function () {
    if (player.level > 5) {
        if ( Math.random() < 0.1 ) {
            this.y = 63 + 83 * 3;
        }
    }
};

//THIS CONTROLS THE VELOCITY (SPEED & DIRECTION) OF ENEMYS
Enemy.prototype.move = function (dt) {
    if (this.dir == -1) {//RESETS BUG POSITION TO START FOR BUGS GOING LEFT
        if (this.x < -151) {
            this.x = 555;
            this.y = floorSelect();
            this.surprise();
        }
        this.x -= this.level*this.speed*dt;
    } else {
        if (this.x > 555) { //RESETS BUG POSITION TO START FOR BUGS GOING RIGHT
            this.x = -151;
            this.y = floorSelect();
            this.surprise();
        }
        this.x += this.level*this.speed*dt;
    }
};

/*****************************************************************

                        PLAYER CLASS (CHILD)

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
    this.levelUS = 200;// SETS THE MULTIPLIER TO POINTS REQUIRED TO LEVEL UP
    this.time = 0;
    this.timeDead = 0;
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.oldSprite = this.sprite;
    this.dead = false;
    this.score = 0;
    this.topScore = 0;
    this.gameOver = false;
    this.playerSelect = false;
    this.spriteSel = 'images/Selector.png';
    this.spriteChar0 = 'images/char-boy.png';
    this.char0Score = 0;////SETS SCORE REQUIRED TO UNLOCK CHARACTOR 0 (NO SCORE REQUIRED)
    this.spriteChar1 = 'images/char-pink-girl.png';
    this.char1Score = 600;//SETS SCORE REQUIRED TO UNLOCK CHARACTOR 1
    this.spriteChar2 = 'images/char-cat-girl.png';
    this.char2Score = 1800;//SETS SCORE REQUIRED TO UNLOCK CHARACTOR 2
    this.spriteChar3 = 'images/char-princess-girl.png';
    this.char3Score = 3000;//SETS SCORE REQUIRED TO UNLOCK CHARACTOR 3
    this.spriteChar4 = 'images/char-horn-girl.png';
    this.char4Score = 6000;//SETS SCORE REQUIRED TO UNLOCK CHARACTOR 4
};

//GIVES PLAYER CLASS ACCESS TO BLOCK PARENT CLASS FUNCTIONS
Player.prototype = new Block(202, 63+83*4);
Player.prototype.constructor = Player;

Player.prototype.update = function (dt) {
    if (this.dead) { //CHECKS TO SEE IF PLAYER DIED
        this.sprite = 'images/skull-cartoon.png';
        this.timeDead += dt;
        if (this.timeDead > 3) {
            this.reset();
        }
    }
    if (this.lives === 0) { //CHECKS IF PLAYER HAS LOST ALL LIVES
        this.gameOver = true;
        this.sprite = 'images/skull-cartoon.png';
        goSound.play();
    }
    if (this.score > this.topScore) { //CHECKS IF NEW HIGH SCORE REACHED
        this.topScore = this.score;
    }
    this.levelUp(dt); //CHECKS FOR NEED OF PLAYER LEVEL UP
};

Player.prototype.levelUp = function (dt) {//LEVELS PLAYER UP
    if (this.score > this.levelUS) {//CHECKS IF PLAYERS POINTS HAVE REACHED NEXT LEVEL
        this.level ++;
        this.levelUS += this.levelUS;
        if (this.level > 4) {
            this.levelUS -= this.levelUS / 4;
        }
        if (this.level % 2 === 0) {
            if (allEnemies.length < 4) {
                allEnemies.push(new Enemy());
            }
        }
        if (allItems.length < 10) {
            if (Math.random() < 0.2) {
                addItem('blue');
            } else if (Math.random() < 0.4) {
                addItem('green');
            } else if (Math.random() < 0.7) {
                addItem('orange');
            }
        }
    }
};

//RESETS THE PLAYERS POSITION TO THE STARTING POSITION
Player.prototype.reset = function () {
    this.x = 202;
    this.y = 63+83*4;
    this.sprite = this.oldSprite;
    this.timeDead = 0;
    this.dead = false;
};

//THIS KILLS THE PLAYER, AND TAKES A LIFE
Player.prototype.death = function () {
    this.lives --;
    if (this.lives !== 0) {
        llSound.play();
    }
    this.dead = true;
    this.playerSelect = false;
};

//THIS FUNCTION HANDLES ALL KEY INPUTS MADE BY THE PLAYER: either to move the character, change the character or reset the game
Player.prototype.handleInput = function (input) {
    //This is checks that the player is alive. If he is, then he can move.
    this.xLast = this.x;
    this.yLast = this.y;
    if (this.lives > 0 && !this.dead) {
        switch(input) {
            case 'left':
                if (this.x > 100 && !this.playerSelect) {
                    this.x -= 101;
                } else if (this.selX > 100 && this.playerSelect) {
                    this.selX -= 91;
                }
                break;
            case 'right':
                if (this.x < 404 && !this.playerSelect) {
                    this.x += 101;
                } else if (this.selX < 384 && this.playerSelect) {
                    this.selX += 91;
                }
                break;
            case 'up':
                if (this.y > 62 && !this.playerSelect) {
                    this.y -= 83;
                }
                break;
            case 'down':
                if (this.y < 395 && !this.playerSelect) {
                    this.y += 83;
                }
                break;
            case 'p':
                this.playerSelect = true;
                this.selX = 20;
                this.selY = 330;
                break;
            case 'enter': //THIS CHECKS THE PLAYERS CHARACTER SELECTION HAS BEEN UNLOCKED
                if(this.playerSelect) {
                    if (this.selX == 20) {
                        this.sprite = this.spriteChar0;
                        this.oldSprite = this.spriteChar0;
                        this.playerSelect = false;
                    } else if (this.selX == 20 + 91 && this.char1Score < this.topScore) {
                        this.sprite = this.spriteChar1;
                        this.oldSprite = this.spriteChar1;
                        this.playerSelect = false;
                    } else if (this.selX == 20 + 182 && this.char2Score < this.topScore) {
                        this.sprite = this.spriteChar2;
                        this.oldSprite = this.spriteChar2;
                        this.playerSelect = false;
                    } else if (this.selX == 20 + 273 && this.char3Score < this.topScore) {
                        this.sprite = this.spriteChar3;
                        this.oldSprite = this.spriteChar3;
                        this.playerSelect = false;
                    } else if (this.selX == 20 + 364 && this.char4Score < this.topScore) {
                        this.sprite = this.spriteChar4;
                        this.oldSprite = this.spriteChar4;
                        this.playerSelect = false;
                    }
                }
                break;
            default:
                break;
        }
    }
    if (input == 'r') { // RESETS THE GAME
        resetAllItems();
    }
};

//BELOW ARE 2 PLAYER FUNCTIONS THAT ALSO DRAW OUT MESSAGES, ALL OTHER ELEMENTS RELY ON RENDER
Player.prototype.scoreBoard = function () { //DRAWS THE SCORE BOARD
    ctx.font = 'bold 25px Verdana';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    //DRAW THE SCORE
    ctx.fillText('SCORE: ' + this.score, 0, 20);

    //DRAW THE LIVES
    ctx.font = '25px Verdana';
    ctx.textAlign = 'right';
    ctx.fillText(':LIVES', 505, 20);
    for (var i = 0; i < this.lives; i++) {
        if (i >= 3) {
            ctx.drawImage(Resources.get('images/scoreplus.png'), 392 - 27 * i, 0);
            break;
        }
        ctx.drawImage(Resources.get('images/scoreheart.png'), 392 - 27 * i, 0);
    }

    //DRAW LEVELS
    ctx.fillText(this.level + ' :LEVEL', 505, 45);

    //DRAW THE TOP-SCORE
    ctx.font = 'bold 18px Verdana';
    ctx.textAlign = 'left';
    ctx.fillText('TOP-SCORE: ' + this.topScore, 0, 45);
};

//GIVES THE PLAYER THE ABILITY TO SELECT THE CHARACTER THEY WANT TO PLAY
Player.prototype.plSelect = function () {
    ctx.drawImage(Resources.get('images/Player-Select.png'), 16, 64.5);
    ctx.drawImage(Resources.get(this.spriteSel), this.selX, this.selY);
    ctx.drawImage(Resources.get(this.sprite), 101, 210); //GETS PLAYERS CURRENT CHARACTER
    for (var i = 0; i < 5; i++) {
         ctx.drawImage(Resources.get(this['spriteChar'+i]), 20 + 91 * i, 330);
        if (this['char'+i+'Score'] > this.topScore) {
            ctx.drawImage(Resources.get('images/no-select.png'), 20 + 91 * i, 330);
        }
    }
};

/*****************************************************************

                        EXTRA ITEMS CLASS (CHILD)

MUST SET WHAT THE ITEM IS TO USE 'ITEMS' CLASS

Select a Item:
   "orange" - Orange Gem: Worth 10 points
   "green" - Green Gem: Worth 25 points
   "blue" - Blue Gem: Worth 80 points
   "heart" - Gives people a life
   "star" - Makes player invulnerable //NOT PROGRAMED IN YET
   "rock" - Creates a rock

******************************************************************/

var Item = function (item) {
    switch (item) {
        case 'orange':
            this.id = item;
            this.score = 25;
            this.sprite = 'images/Gem Orange.png';
            this.tTime = 13;
            this.chance = 0.7; //70% CHANCE OF THIS PIECE SHOWING
            this.hTime = 3;
            break;
        case 'green':
            this.id = item;
            this.score = 70;
            this.sprite = 'images/Gem Green.png';
            this.tTime = 10;
            this.chance = 0.4; //40% CHANCE OF THIS PIECE SHOWING
            this.hTime = 3;
            break;
        case 'blue':
            this.id = item;
            this.score = 150;
            this.sprite = 'images/Gem Blue.png';
            this.tTime = 7;
            this.chance = 0.2; //20% CHANCE OF THIS PIECE SHOWING
            this.hTime = 3;
            break;
        case 'heart':
            this.id = item;
            this.tTime = 7;
            this.sprite = 'images/Heart.png';
            this.chance = 0.1;
            this.hTime = 10;
            break;
        case 'star':
            this.id = item;
            this.sprite = 'images/Star.png';
            this.tTime = 5;
            this.chance = 0.02;
            this.hTime = 30;
            break;
        case 'rock':
            this.id = item;
            this.sprite = 'images/Rock.png';
            this.tTime = 20;
            this.chance = 0.8;
            this.hTime = 2;
            break;
        default:
            break;
    }
    this.show = false;
    this.sTime = 0;
    this.holdTime = 0;
};

//GIVES ITEMS THE ACCESS TO BLOCK FUNCTIONS, AND SETS DEFAULT POSITION
Item.prototype = new Block();
Item.prototype.constructor = Item;

//CONTROLS THE TIME IN AND OUT OF EACH ITEM ON THE BOARD. CONTROLS WHEN TO SHOW THEM, AND WHEN NOT TO
Item.prototype.update = function (dt) {
    if (!this.show && Math.random() < this.chance && this.holdTime > this.hTime) {
        if (this.id == 'rock') {
            if (player.level >= this.rockStrtLvl) {
                this.show = true;
                this.holdTime = 0;
                this.move();
            }
        } else if (this.id == 'heart') {
            if (player.level >= 6) {
                this.show = true;
                this.holdTime = 0;
                this.move();
            }
        } else if (this.id == 'orange' || this.id == 'blue' || this.id == 'green') {
            this.show = true;
            this.holdTime = 0;
            this.move();
        }
    } else if (!this.show) {
        this.holdTime += dt;
        this.x = -101;
        this.y = -171;
    }
    if (this.show && this.sTime > this.tTime) {
        this.show = false;
        this.x = -101;
        this.y = -171;
        this.sTime = 0;
    } else if (this.show) {
        this.sTime += dt;
    }
    if (this.id == 'rock') {
        if (this.x == player.x && this.y + 8 == player.y) {
            player.x = player.xLast;
            player.y = player.yLast;
        }
    }
};

Item.prototype.move = function () {//DETECTS IF THERES A FREE SPOT AND MOVES THE ITEM TO IT
    var x = 101 * Math.floor(Math.random() * 5);
    var y = 63;
    if (this.id == 'rock') {
        y = 55 + 83 * Math.floor(Math.random() * 4);
    } else {
        y = floorSelect();
    }
    var noMatch = 0;
    allItems.forEach(function (item) {
        if (item.x != x && item.y != y) {
            noMatch ++;
        }
    });
    if (allItems.length == noMatch) {
        this.x = x;
        this.y = y;
        return;
    }
    this.show = false;
};

/*****************************************************************

                      CUSTOM FUNCTIONS

1) resetAllItems
    This reset all items within the game to the start setting
        2 Gems
        0 Enemies
        3 lives
        Score to zero

2) addItem
    This adds an item within the allItems array
        - Orange Gem - worth 25 points
        - Green Gem - worth 60 points
        - Blue Gem - worth 150 points
        - Rock - creates a rock which will spawn at a certain multi of the players' level
        - Heart - self explanatory.... adds a life (Only shows up at level 6)
        - Star - Has not been added into the game... doesn't do anything yet


******************************************************************/

//THIS FUNCTION HELPS RANDOMLY SELECT WHICH FLOORS ENEMYS APPEAR ON
function floorSelect() {
    return 63 + 83 * Math.floor(Math.random()*3);
}

//THIS FUNCTION RESETS THE GAME
function resetAllItems() {
    allEnemies = [];
    allItems = [];
    for (var i = 0; i < 2; i++) {
        addItem('orange');
        addItem('rock', i + 1);
    }
    addItem('heart');
    player.x = 202;
    player.y = 63+83*4;
    player.dead = false;
    player.lives = 3;
    player.level = 1;
    player.levelUS = 200;
    player.score = 0;
    player.sprite = 'images/char-boy.png';
    player.gameOver = false;
    player.imgGameOver = 'images/game-over.png';
    player.imgEaten = 'images/eaten.png';
    player.imgDrown = 'images/drowned.png';
    player.playerSelect = false;
}

//THIS FUNCTION ADDS ITEMS TO THE allItems ARRAY
function addItem(item, multi) {
     switch (item) {
        case 'orange':
            allItems.push(new Item ('orange'));
            break;
        case 'green':
            allItems.push(new Item('green'));
            break;
        case 'blue':
            allItems.push(new Item('blue'));
            break;
        case 'heart':
            allItems.push(new Item('heart'));
            break;
        case 'star':
            allItems.push(new Item('star'));
            break;
        case 'rock':
            allItems.push(new Item('rock'));
            allItems[allItems.length - 1].rockStrtLvl = 4 * multi;
            break;
        default:
            break;
     }
}

document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        83: 's',
        82: 'r',
        80: 'p',
        13: 'enter'
    };
    //alert(e.keyCode); //THIS IS USED TO FIGURE OUT WHAT DIFFERENT CODES ARE FOR KEYS
    player.handleInput(allowedKeys[e.keyCode]);
});


/*****************************************************************

                      GAME SOUNDS

These are the classes which hold all the games sounds

IN GAME MUSIC - must be called with '.play()' to work

******************************************************************/

var bgMusic = document.getElementById('bckGrdMusic'); //GETS BACKGROUND MUSIC FROM HTML
var gemSound = document.getElementById('gemSound'); //GETS GEM SOUND FROM HTML
var hrtSound = document.getElementById('hrtSound'); //GETS HEART SOUND FROM HTML
var goSound = document.getElementById('gameOverSound'); //GETS GAME OVER SOUND FROM HTML
var llSound = document.getElementById('lifeLostSound'); //GETS LIVE LOST SOUND FROM HTML

/*****************************************************************

                      GAME START PROPERTIES

These properties must be declared to start the game

IN GAME MUSIC - also must be declared

******************************************************************/

var allItems = [];
var allEnemies = [];
var player = new Player();
bgMusic.play(); //STARTS THE BACKGROUND MUSIC
