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
    this.highScore = 0;
    var temp = localStorage.getItem("highScore");
    if (temp != undefined)
      this.highScore = temp;
    this.life = 1;
    this.reborn = false;
    this.currentFrame = 0;
    this.totalFrames = 60;
    this.explosions = [];
    for (var i = 0; i < 3; i++) {
        this.explosions[this.explosions.length] = new Explosion();
    };

}
Jet.prototype.update = function(){

    this.checkShooting();
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) 
            this.bullets[i].update();
        if (this.bullets[i].explosion.hasHit) {
            this.bullets[i].explosion.update();
        }
    }
   if(this.reborn)
    {
        if (this.currentFrame <= this.totalFrames ) {
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
    }
    for (var i = 0; i < this.explosions.length; i++) {
        if (this.explosions[i].hasHit) {
            bombSound.play();
            this.explosions[i].update();
        }
    }
}
Jet.prototype.draw = function() {
    
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) 
            this.bullets[i].draw();
        if (this.bullets[i].explosion.hasHit) {
            exploSound.play();
            this.bullets[i].explosion.draw();
        }
    }

    if(this.reborn)
    {
        if (this.currentFrame <= this.totalFrames ) {
                myContext.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        }
    }
    else
    {
        myContext.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    }
    for (var i = 0; i < this.explosions.length; i++) {
        if (this.explosions[i].hasHit) {
            this.explosions[i].draw();
        }
    }
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
        moveSound.play();
    }
    if (this.isRightKey && this.rightX < gameWidth) {
        this.drawX += this.speed;
        moveSound.play();
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
        this.drawY += this.speed;
        moveSound.play();
    }
    if (this.isLeftKey && this.leftX > 0) {
        this.drawX -= this.speed;
        moveSound.play();
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
    if(supports_html5_storage() && this.score > this.highScore)
    {
        this.highScore = this.score;
        localStorage.setItem("highScore", this.score );
    }

};

Jet.prototype.updateLife = function(lifes) {
    this.life += lifes;
    if(this.life < 0)
    {
        isPlaying = false;
    }
    else
    {
        lifeSound.play();
    }
};