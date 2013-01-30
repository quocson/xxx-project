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

Life.prototype.update = function() {
    if(!this.hasHit)
    {
        this.drawX -= this.speed;
        this.checkHitJet();
        this.checkEscaped();
    }
    else {
        if (this.currentFrame <= this.totalFrames ) {
            this.currentFrame++;
        }
        else
            this.recycle();
    }
};

Life.prototype.draw = function() {
    if(!this.hasHit)
    {
        ctxLife.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
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