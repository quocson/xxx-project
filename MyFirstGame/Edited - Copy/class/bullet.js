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

Bullet.prototype.update = function() {
    this.drawX += this.speed;
    //check hit enemy
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
    if (this.drawX > gameWidth)
        this.recycle();
};
Bullet.prototype.draw = function() {
    myContext.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Bullet.prototype.fire = function(startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};

Bullet.prototype.recycle = function() {
    this.drawX = -20;
};