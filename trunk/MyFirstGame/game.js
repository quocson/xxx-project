var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasLife = document.getElementById('canvasLife');
var ctxLife = canvasLife.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(0, 0%, 0%, 0.4)";
ctxHUD.font = "bold 20px Tahoma";


var gameFPS = 0;
var frameCount = 0;
var lastTime = new Date();
var currentTime = new Date();
var diffTime = 0;



var myJet = new Jet();
var enemies = [];
var lifes = [];
var btnPlay = new Button(265, 535, 220, 335);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var bgDrawX1 = 0;
var bgDrawX2 = 1600;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var decline = 60;
var imgSprite = new Image();
imgSprite.src = 'images/sprite.png';
imgSprite.addEventListener('load', init, false);
var requestAnimFrame =  window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};



// main functions

function init() {
    spawnEnemy(6);
    spawnLife(1);
    drawMenu();
    document.addEventListener('click', mouseClicked, false);
}

function playGame() {
    drawBg();
    startLoop();
    updateHUD();
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
}

function spawnEnemy(number) {
    for (var i = 0; i < number; i++) {
        enemies[enemies.length] = new Enemy(myJet);
    }
}

function spawnLife(number) {
    for (var i = 0; i < number; i++) {
        lifes[lifes.length] = new Life(myJet);
    }
}

function drawAllEnemies() {
    clearCtxEnemy();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();

    }
}

function drawAllLifes() {
    clearCtxLife();
    for (var i = 0; i < lifes.length; i++) {
        lifes[i].draw();
    }
}

function loop() {
    currentTime = new Date();
    diffTime = Math.ceil((currentTime.getTime() - lastTime.getTime()));

    if (diffTime >= 1000) 
    {
        gameFPS = frameCount;
        frameCount = 0;
        lastTime = currentTime;
    }
    frameCount ++;
    if (decline > 0) {
        if(!isPlaying)
            decline--;
        moveBg();
        myJet.draw();
        drawAllEnemies();
        drawAllLifes();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
}

function stopLoop() {
    isPlaying = false;
}

function drawMenu() {
    ctxBg.drawImage(imgSprite, 0, 580, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}

function drawBg() {
    ctxBg.clearRect(0, 0, gameWidth, gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX1, 0, 1600, gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX2, 0, 1600, gameHeight);
}

function moveBg() {
    bgDrawX1 -= 5;
    bgDrawX2 -= 5;
    if (bgDrawX1 <= -1600) {
        bgDrawX1 = 1600;
    } else if (bgDrawX2 <= -1600) {
        bgDrawX2 = 1600;
    }
    drawBg();
}

function updateHUD() {
    ctxHUD.clearRect(0, 0, gameWidth, gameHeight);
    ctxHUD.fillText("FPS: " + gameFPS + " | Life: " + myJet.life + " | Score: " +
                      myJet.score + " | High Score: XXX", 20, 480);
}
// end of main functions

// jet functions

function Jet() {
    this.srcX = 0;
    this.srcY = 500;
    this.width = 100;
    this.height = 40;
    this.speed = 3;
    this.drawX = 150;
    this.drawY = 220;
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpacebar = false;
    this.isShooting = false;
    this.bullets = [];
    this.currentBullet = 0;
    for (var i = 0; i < 25; i++) {
        this.bullets[this.bullets.length] = new Bullet(this);
    }
    this.score = 0;
    this.life = 1;
    this.reborn = false;
    this.currentFrame = 0;
    this.totalFrames = 60;
    this.explosions = [];
    for (var i = 0; i < 3; i++) {
        this.explosions[this.explosions.length] = new Explosion();
    }
}

Jet.prototype.draw = function() {
    clearCtxJet();
    this.checkShooting();
    this.drawAllBullets();

    if(this.reborn)
    {
        if (this.currentFrame <= this.totalFrames ) {
            if(this.currentFrame % 20 < 10)
                ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
            this.currentFrame++;
        } 
        else
        {
            this.reborn = false;
            this.currentFrame = 0;
        }
    }
    else
    {
        this.checkDirection();
        this.updateCoors();
        ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    }
    this.drawAllExplosions();
};

Jet.prototype.updateCoors = function() {
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
};


Jet.prototype.checkDirection = function() {
    if (this.isUpKey && this.topY > 0) {
        this.drawY -= this.speed;
    }
    if (this.isRightKey && this.rightX < gameWidth) {
        this.drawX += this.speed;
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
        this.drawY += this.speed;
    }
    if (this.isLeftKey && this.leftX > 0) {
        this.drawX -= this.speed;
    }
};

Jet.prototype.drawAllBullets = function() {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) this.bullets[i].draw();
        if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
    }
};

Jet.prototype.drawAllExplosions = function() {
    for (var i = 0; i < this.explosions.length; i++) {
        if (this.explosions[i].hasHit) this.explosions[i].draw();
    }
};

Jet.prototype.checkShooting = function() {
    if (this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) this.currentBullet = 0;
    } else if (!this.isSpacebar) {
        this.isShooting = false;
    }
};

Jet.prototype.updateScore = function(points) {
    this.score += points;
    updateHUD();
};

Jet.prototype.updateLife = function(lifes) {
    this.life += lifes;
    if(this.life < 0)
        isPlaying = false;
    else
        updateHUD();
};


function clearCtxJet() {
    ctxJet.clearRect(0, 0, gameWidth, gameHeight);
}

// end of jet functions




// bullet functions

function Bullet(j) {
    this.jet = j;
    this.srcX = 100;
    this.srcY = 500;
    this.drawX = -20;
    this.drawY = 0;
    this.width = 5;
    this.height = 5;
    this.speed = 7;
    this.explosion = new Explosion();
}

Bullet.prototype.draw = function() {
    this.drawX += this.speed;
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkHitEnemy();
    if (this.drawX > gameWidth) this.recycle();
};

Bullet.prototype.fire = function(startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};

Bullet.prototype.checkHitEnemy = function() {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.drawY >= enemies[i].drawY &&
            this.drawY <= enemies[i].drawY + enemies[i].height) {
            this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
        this.explosion.drawY = enemies[i].drawY;
        this.explosion.hasHit = true;
        this.recycle();
        enemies[i].recycle();
        this.jet.updateScore(enemies[i].rewardPoints);
    }
}
};

Bullet.prototype.recycle = function() {
    this.drawX = -20;
};


// end of bullet functions



// explosion functions

function Explosion() {
    this.srcX = 750;
    this.srcY = 500;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 50;
    this.height = 50;
    this.hasHit = false;
    this.currentFrame = 0;
    this.totalFrames = 30;
}

Explosion.prototype.draw = function() {
    if(this.currentFrame <= this.totalFrames ) {
        if(this.currentFrame % 15 < 8)
            ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;  
    } 
    else
    {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};


// end of explosion functions

// enemy functions

function Enemy(j) {
    this.jet = j;
    this.srcX = 0;
    this.srcY = 540;
    this.width = 100;
    this.height = 40;
    this.speed = Math.floor(Math.random() * 9) + 1;
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
    this.rewardPoints = this.speed;
    this.minusLife = -1;

}

Enemy.prototype.draw = function() {
    this.drawX -= this.speed;
    ctxEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);   
    this.checkHitJet();
    this.checkEscaped();
};

Enemy.prototype.checkEscaped = function() {
    if (this.drawX + this.width <= 0) {
        this.recycle();
    }
};

Enemy.prototype.recycle = function() {
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
};

function clearCtxEnemy() {
    ctxEnemy.clearRect(0, 0, gameWidth, gameHeight);
}

Enemy.prototype.checkHitJet = function() {
    if ((this.drawX >= this.jet.drawX &&
        this.drawX <= this.jet.drawX + this.jet.width &&
        this.drawY >= this.jet.drawY &&
        this.drawY <= this.jet.drawY + this.jet.height) ||
        (this.drawX + this.width >= this.jet.drawX &&
            this.drawX + this.width <= this.jet.drawX + this.jet.width &&
            this.drawY + this.height >= this.jet.drawY &&
            this.drawY + this.height <= this.jet.drawY + this.jet.height)) {

        for (var i = 0; i < 3; i++) {
            this.jet.explosions[i].drawX = this.jet.drawX  + i * (this.jet.width / 3) - (this.jet.explosions[i].width / 3);
            
            this.jet.explosions[i].drawY = this.jet.drawY;
            if(i === 1)
                this.jet.explosions[i].drawY += (this.jet.height / 2);
            this.jet.explosions[i].drawY -= (this.jet.explosions[i].height / 3);
            this.jet.explosions[i].hasHit = true;
        }
        this.recycle();
        this.jet.updateLife(this.minusLife);
        this.jet.reborn = true;

    }
};

// end enemy functions

// life functions

function Life(j) {
    this.jet = j;
    this.srcX = 105;
    this.srcY = 500;
    this.width = 28;
    this.height = 28;
    this.speed = 2;
    this.hasHit = false;
    this.currentFrame = 0;
    this.totalFrames = 60;
    this.rewardLifes = 1;
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 500) + this.height;
}

Life.prototype.draw = function() {
    if(!this.hasHit)
    {
        this.drawX -= this.speed;
        ctxLife.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);    
        this.checkHitJet();
        this.checkEscaped();
    }
    else {
        if (this.currentFrame <= this.totalFrames ) {
            if(this.currentFrame % 20 < 10)
                ctxLife.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
            this.currentFrame++;
        }
        else
            this.recycle();
    }
};

Life.prototype.checkEscaped = function() {
    if (this.drawX + this.width <= 0) {
        this.recycle();
    }
};

Life.prototype.recycle = function() {
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
    this.hasHit = false;
    this.currentFrame = 0;
};

function clearCtxLife() {
    ctxLife.clearRect(0, 0, gameWidth, gameHeight);
}

Life.prototype.checkHitJet = function() {
    if ((this.drawX >= this.jet.drawX &&
        this.drawX <= this.jet.drawX + this.jet.width &&
        this.drawY >= this.jet.drawY &&
        this.drawY <= this.jet.drawY + this.jet.height) ||
        (this.drawX + this.width >= this.jet.drawX &&
            this.drawX + this.width <= this.jet.drawX + this.jet.width &&
            this.drawY + this.height >= this.jet.drawY &&
            this.drawY + this.height <= this.jet.drawY + this.jet.height)) {
        this.hasHit = true;
    this.jet.updateLife(this.rewardLifes);
}
};

// end life functions




// button functions

function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

Button.prototype.checkClicked = function() {
    if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
};

// end of button functions


// event functions
function mouseClicked(e) {
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (!isPlaying) {
        if (btnPlay.checkClicked()) playGame();
    }
}

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        myJet.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        myJet.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        myJet.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        myJet.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        myJet.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        myJet.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        myJet.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        myJet.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        myJet.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        myJet.isSpacebar = false;
        e.preventDefault();
    }
}

// end of event functions