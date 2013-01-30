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
Enemy.prototype.update = function(){
    this.drawX -= this.speed;
    this.checkHitJet();
    this.checkEscaped();
}
Enemy.prototype.draw = function() {
    ctxEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);   
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