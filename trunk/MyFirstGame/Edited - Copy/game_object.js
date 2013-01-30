var myCanvas = document.getElementById('myCanvas');
var myContext = myCanvas.getContext('2d');
myContext.fillStyle = "hsla(0, 0%, 0%, 0.4)";
myContext.font = "bold 15px Tahoma";


var gameFPS = 0;
var frameCount = 0;
var lastTime = new Date();
var currentTime = new Date();
var diffTime = 0;



var myJet = new Jet();
var enemies = [];
var lifes = [];
var btnPlay = new Button(265, 535, 220, 335);
var gameWidth = myCanvas.width;
var gameHeight = myCanvas.height;
var bgDrawX1 = 0;
var bgDrawX2 = 1600;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var decline = 60;
var imgSprite = new Image();
imgSprite.src = 'images/sprite.png';
imgSprite.addEventListener('load', init, false);
var exploSound = new Audio('audios/explosion.mp3');
var bombSound = new Audio('audios/bomb.mp3');
var lifeSound = new Audio('audios/life.mp3');
var moveSound = new Audio('audios/move.mp3');
var bgMusic = new Audio('audios/battle.mp3');
bgMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
bgMusic.play();
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
        update()
        requestAnimFrame(loop);
        draw();
    }
}
function update(){
    if(!isPlaying)
        decline--;
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }
    for (var i = 0; i < lifes.length; i++) {
        lifes[i].update();
    }
    myJet.update();
    if(decline == 0)
    {
        isPlaying = false;
    }
}
function draw(){
    clearMyContext();
    
    moveBg();

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();

    }

    for (var i = 0; i < lifes.length; i++) {
        lifes[i].draw();
    }

    myContext.fillText("FPS: " + gameFPS + " | Life: " + myJet.life + " | Score: " +
      myJet.score + " | High Score: " + myJet.highScore, 20, 480);

    myJet.draw();

    if(decline == 0)
    {//menu
        clearMyContext();
        drawMenu();
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
    myContext.drawImage(imgSprite, 0, 580, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}

function drawBg() {
    myContext.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX1, 0, 1600, gameHeight);
    myContext.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX2, 0, 1600, gameHeight);
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



function clearMyContext() {
    myContext.clearRect(0, 0, gameWidth, gameHeight);
}


// event functions
function mouseClicked(e) {
    mouseX = e.pageX - myCanvas.offsetLeft;
    mouseY = e.pageY - myCanvas.offsetTop;
    if (!isPlaying) {
        if (btnPlay.checkClicked()) {
            isPlaying = true;
            myJet.score = 0;
            myJet.life = 1;
            decline = 60;
            playGame();
        }
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

function supports_html5_storage()
{
      try
        {
            return 'localStorage' in window &&
            window['localStorage'] !== null &&
            window['localStorage'] !== undefined;
        }
        catch (e)
        {
           return false;
        }
}
// end of event functions