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
Explosion.prototype.update = function() {
    if(this.currentFrame <= this.totalFrames ) {
            this.currentFrame++;
    }
    else
    {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};
Explosion.prototype.draw = function() {
    if(this.currentFrame <= this.totalFrames ) {
        if(this.currentFrame % 15 < 8)
            ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    }
};