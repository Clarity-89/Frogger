var counter = 0, // Global variable used to set different positions for enemies
    player, allEnemies, lives, sprite, selected, score,
    tryAgain = document.getElementById('try-again'),
    over = false, // a switch variable to track if the player run out of lives
    gameover = document.getElementById('gameover'),
    scoreField = document.getElementById('score'),
    startButton = document.getElementById('start'),
    chars = document.querySelectorAll('#chars .col-md-2 img'),
    err = document.getElementById('err'),
    startScreen = document.getElementById('start-screen');

// Enable iterating over NodeList with forEach and some since it is not a proper Array
NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.some = Array.prototype.some;

//Check if a sprite was selected

var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -40;
    // Make sure each new Enemy has different vertical position
    this.y = 60 + 80 * (counter % 3);
    counter++;
    // Different speed for each enemy
    this.speed = Math.floor(Math.random() * 300) + 100;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype = {
    update: function (dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += dt * this.speed;

        // If an enemy moves off the screen delete it from the array and add a new one
        if (this.x > 500) {
            allEnemies.splice(allEnemies.indexOf(this), 1);
            allEnemies.push(new Enemy());
        }
    },
    // Draw the enemy on the screen, required method for game
    render: function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    collide: function (obj) {
        if (obj.x <= this.x + 30 && obj.x >= this.x - 30 && obj.y <= this.y + 30 && obj.y >= this.y - 30) {
            player.reset();
            lives.pop();
            if (lives.length === 0) {
                reset();
                //startGame();
            }
        }
    }
};
// player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (sprite) {
    // Initial position
    this.x = 200;
    this.y = 410;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;

};
Player.prototype = {
    update: function (vel_x, vel_y) {
        if (this.y < 0) {
            this.reset();
            score.update();
        }
        if (this.x + vel_x / 10 < 400 && this.x + vel_x / 10 > 0) {
            this.x += vel_x;
        }
        if (this.y + vel_y / 10 < 410 && this.y + vel_y / 10 > -10) {
            this.y += vel_y;
        }
    },
    render: function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    },
    handleInput: function (key) {
        var val = 70;
        switch (key) {
            case 'up':
                this.update(0, -val);
                break;
            case 'down':
                this.update(0, val);
                break;
            case 'left':
                this.update(-val, 0);
                break;
            case 'right':
                this.update(val, 0);
                break;
            default:
                console.log("Key not supported");
        }
    },
    reset: function () {
        this.x = 200;
        this.y = 410;
    }

};

// Object to keep track of player's lives
var Life = function () {
    // Initial position
    this.x = 460;
    this.y = 55;
    this.sprite = 'images/heart_icon.png';
};

Life.prototype = {
    render: function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

var Score = function () {
    this.count = 0;
    this.x = 10;
    this.y = 80;
};

Score.prototype = {
    render: function () {
        ctx.font = "32px 'Kaushan Script'";
        ctx.fillText('Score: ' + this.count, this.x, this.y);
    },

    update: function () {
        this.count += 1;
    }
};

function startGame() {
    over = false;
    startScreen.style.display = 'none';
    gameover.style.display = 'none';
    scoreField.innerHTML = 'Your score is:';
    sprite = document.getElementsByClassName('active')[0].getAttribute('src');
    // Now instantiate the objects.
// Place all enemy objects in an array called allEnemies
    allEnemies = [];
    for (var k = 0; k < 3; k++) {
        allEnemies[k] = new Enemy();
    }

// Place the player object in a variable called player
    player = new Player(sprite);

// Create an array containing player's lives
    lives = [];
    for (var i = 0, j; i < 3; i++) {
        j = 35 * i;
        lives[i] = new Life();
        lives[i].x -= j;
    }

    // Instantiate score
    score = new Score();
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* This function does nothing but it could have been a good place to
 * handle game reset states - maybe a new game menu or a game over screen
 * those sorts of things. It's only called once by the init() method.
 */
function reset() {

    gameover.style.display = 'block';
    scoreField.innerHTML += ' ' + score.count;
    over = true;

}
function selectChar() {
    chars.forEach(function (el) {
        el.onclick = function () {
            chars.forEach(function (el2) {
                el2.classList.remove('active');
            });
            el.classList.add('active');
        }
    });
}
selectChar();





