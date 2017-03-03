/**
 * Created by B00251398 on 21/02/2017.
 *
 * Last Modified by B00272851 on 03/03/2017
 */

var Game = function(game) {};

Game.prototype = {
    preload :preload,
    create :create,
    update: update

};


function preload(){

    game.load.spritesheet('player', 'Assets/Alan.png', 22, 21);
    game.load.image('bullet', 'Assets/Bullet.png');
    game.load.image('mag', 'Text/Mag.png');
    game.load.image('scoreTitle', 'Text/scoreTitle.png');
    game.load.image('floor', 'Assets/ground.png');
    game.load.image('pickup', 'Assets/pickup.png');
    game.load.image('healthHud', 'Assets/healthHUD.png');
    game.load.image('fullHeart', 'Assets/fullHeart.png');
    game.load.image('halfHeart', 'Assets/halfHeart.png');
    game.load.image('emptyHeart', 'Assets/emptyHeart.png');
    game.load.image('snail', 'Assets/snail.png');

}


var player, bullets, jumpButton, leftButton, rightButton, pauseButton, magText, magTitle, reloadButton, shootButton, scoreTitle, alertText, platforms, pickups, scoreText, healthHud,
    healthHearts, heart1, heart2, heart3, snails, healthkits;

var fireRate = 100;
var nextFire = 0;
var mag = 10;
var score = 0;
var health = 40;

var allowNoBullets = true;
var allowShoot = true;
var aimRight = true;
var shootRight = 600;
var aimLeft = false;
var shootLeft = -600;
var playerDead = false;


function create() {

    //score text and title is displayed on screen
    scoreText = game.add.text(80, 30, '' + score, {fontSize: '15px', fill: '#FF0000'});
    scoreTitle = game.add.sprite(0, 25, "scoreTitle");
    scoreText.text = '' + score;
    //ammo title and text is displayed on screen
    magTitle = this.game.add.sprite(0,0, "mag", this);
    magText = game.add.text(70, 3, '' + mag, {fontSize: '15px', fill: '#FF0000'});
    alertText = game.add.text(0, 80, "", {fontSize: '15px', fill: '#FF0000'});

    healthHearts = game.add.group();
    heart1 = healthHearts.create(30, 62,'fullHeart');
    heart2 = healthHearts.create(60, 62,'fullHeart');
    heart3 = healthHearts.create(90, 62,'fullHeart');
    healthHud = game.add.sprite(0, 60, "healthHud");

    scoreTitle.fixedToCamera = true;
    scoreText.fixedToCamera = true;
    healthHud.fixedToCamera = true;
    heart1.fixedToCamera = true;
    heart2.fixedToCamera = true;
    heart3.fixedToCamera = true;
    magTitle.fixedToCamera = true;
    magText.fixedToCamera = true;
    alertText.fixedToCamera = true;

    //create text that informs the player they have died

    //physics system is enabled and the player is created anf given attributes such as gravity and bounce
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    var ground =  platforms.create(0, 550,'floor');
    ground.body.immovable = true;
    var ground2 =  platforms.create(600, 550, 'floor');
    ground2.body.immovable = true;
    var platform = platforms.create(350, 400, 'floor');
    platform.body.immovable = true;

    pickups = game.add.group();
    pickups.enableBody = true;
    var pickup1 = pickups.create(100, 0,'pickup');
    pickup1.body.gravity.y = 100;
    pickup1.body.bounce.y = 0.3
    var pickup2 = pickups.create(400, 0,'pickup');
    pickup2.body.gravity.y = 100;
    pickup2.body.bounce.y = 0.3
    var pickup3 = pickups.create(800, 0,'pickup');
    pickup3.body.gravity.y = 100;
    pickup3.body.bounce.y = 0.3

    //create the snail array - gives more flexability to the AI than the group
    snails = [];
    snails.push(new Snail(game.add.sprite(200, 500,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(500, 350,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(700, 500,'snail'), "left"));

    healthkits = game.add.group();
    healthkits.enableBody = true;
    var kit1 = healthkits.create(350, 100,'fullHeart');
    kit1.body.gravity.y = 100;

    //player settings
    player = game.add.sprite(32, 200, 'player');
    game.physics.arcade.enable(player);
    player.body.bounce.setTo(0.2);
    player.body.gravity.setTo(0, 200);
    player.body.collideWorldBounds = true;
    //makes the camera follow the player
    game.camera.follow(player);

    player.animations.add('right', [0, 1], 10, true);
    player.animations.add('left', [3, 4], 10, true);

    // player input
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    reloadButton = game.input.keyboard.addKey(Phaser.Keyboard.R);

    // create bullet group for the player to shoot with
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(10, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
}


function update() {

    game.physics.arcade.collide(pickups, platforms);
    game.physics.arcade.collide(healthkits, platforms);

    var touchPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, pickups, function killPickups(player,pickup) {
        score += 100;
        scoreText.text = '' + score;
        pickup.kill();
    });
    game.physics.arcade.collide(bullets, platforms, function killBullets(bullet) {
        bullet.kill();
    });

    updateEnemies();

    game.physics.arcade.collide(player, healthkits, function (player, healthkit) {

        healthkit.kill();
        if(health < 40){
            health += 20;
        }else{
            health = 60;
        }

    });

    if(health == 60){
        heart1.loadTexture('fullHeart');
        heart2.loadTexture('fullHeart');
        heart3.loadTexture('fullHeart');
    }else if(health == 50){
        heart1.loadTexture('fullHeart');
        heart2.loadTexture('fullHeart');
        heart3.loadTexture('halfHeart');
    }else if (health == 40){
        heart1.loadTexture('fullHeart');
        heart2.loadTexture('fullHeart');
        heart3.loadTexture('emptyHeart');
    }else if(health == 30){
        heart1.loadTexture('fullHeart');
        heart2.loadTexture('halfHeart');
        heart3.loadTexture('emptyHeart');
    }else if (health == 20){
        heart1.loadTexture('fullHeart');
        heart2.loadTexture('emptyHeart');
        heart3.loadTexture('emptyHeart');
    }else if(health == 10){
        heart1.loadTexture('halfHeart');
        heart2.loadTexture('emptyHeart');
        heart3.loadTexture('emptyHeart');
    }else{
        heart1.loadTexture('emptyHeart');
        heart2.loadTexture('emptyHeart');
        heart3.loadTexture('emptyHeart');
        killPlayer();
    }

    player.body.velocity.x = 0;

    // calls reload function when r is pressed
    reloadButton.onDown.add(reloadBreak, this);
    // calls pause function when p is pressed
    pauseButton.onDown.add(pauseFunction, this);

    // Player Movement left right and jumping
    if (leftButton.isDown) {
        //  Move the player to the left
        player.body.velocity.x = -150;
        aimLeft = true;
        aimRight = false;
        player.animations.play('left');
    }
    else if (rightButton.isDown) {
        //  Move the player to the right
        player.body.velocity.x = 150;
        aimRight = true;
        aimLeft = false
        player.animations.play('right');
    }else{
        player.frame = 2;
    }

    if (jumpButton.isDown && player.body.touching.down  && touchPlatform == true) {
        // allow the player to jump if they are touching the ground
        player.body.velocity.y = -250;
    }


    // allows the player to shoot by calling the fire function when the player presses the spacebar
    //depending on where the player is facing a diiferent variable will be passed through to change where the bullet is fire to
    if (shootButton.isDown && aimRight == true)
    {
        playerFires(shootRight);
    }

    if (shootButton.isDown && aimLeft == true){

        playerFires(shootLeft)
    }

    // kills the player if the have fallen off the map limits
    if (player.y > 550){

        killPlayer();
    }
}

// function allows the player to shoot if they have bullets in their magazine. Will also play shooting sound and update the ammo count
function playerFires(shoot) {

    if (game.time.now > nextFire && bullets.countDead() > 0 && mag >0 && allowShoot == true)
    {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstDead();
        bullet.reset(player.x + 4, player.y + 5);
        bullet.body.velocity.x = shoot;
        //sound in here
        mag -= 1;
        magText.text = '' + mag;

    }

//stops the player from shooting when they have no bullets and plays the empty clip sound when they attempt to shoot
    if(mag == 0 && allowNoBullets == true){
        allowNoBullets = false;
        //sound in here
        game.time.events.add(Phaser.Timer.SECOND * 1, playNoBullets, this);
    }
}

// this function creates a delay before calling the reload function. This function also prevents the player from shooting when they are reloading their weapon
function reloadBreak() {

    if(mag < 10)
    {
        allowShoot = false;
        //sound in here
        game.time.events.add(Phaser.Timer.SECOND * 1, reloadWeapon, this);
    }
}

// this function resets the bullets back to 10, changes the text to the 10 bullets and allows the player to fire
function reloadWeapon() {
    mag = 10;
    magText.text = '' + mag;
    allowShoot = true;
}

// this function pauses the game
function pauseFunction(){
    game.paused = !game.paused
}

// boolean used to prevent the player from shooting while they are reloading
function playNoBullets(){
    allowNoBullets = true;
}

function killPlayer() {
    playerDead = true;
    player.kill();
    game.time.events.add(Phaser.Timer.SECOND * 5, respawnPlayer, this, 32, 400);

    alertText.text = "You Died, You will Respawn in 3 seconds"
}

function respawnPlayer(x,y) {
    alertText.text = "";
    score =- 100;
    scoreText.text = "" + score;
    player.reset(x,y);
    player.revive();
    playerDead = false;
    health = 60;
}

function updateEnemies() {
    //update the snails
    for(var i = 0; i < snails.length; i++){
        //move the snail
        snails[i].move();

        //check collisions
        score += snails[i].checkBulletCollision();

        //check player collision
        if(snails[i].isAlive() == true) snails[i].checkPlayerCollision();

    }//next snail

    //update the score
    scoreText.text = '' + score;

    //now that it is out of the loop remove the dead snails
    for(var i = snails.length -1; i >= 0; i--){
        //if snail is dead remove it
        if(snails[i].isAlive() == false){
            snails.splice(i, 1);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Snail class and functions

//constructor and data storage
function Snail(sprite, direction, speed)
{
    //add the variables
    this.sprite = sprite; //snail sprite
    this.direction = direction; //snail direction
    this.oldDirection = direction; //oldDirection is used to flip the image

    this.state = "patrol"; //will be used for adding a random behaviour to it
    this.scoreVaulue = 50; //how much the enemy is worth when killed
    this.health = 2; //health of the enemy
    this.alive = true; //true = alive, false = dead
    this.gravity = 100; //used to allow the snail to fall
    this.oldDirection = direction;

    //setup other values - physics stuff
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.y = this.gravity;

    //sprite stuff
    this.sprite.anchor.setTo(0.5,0.5);
    //check direction - flip for enemies going right
    if(this.direction == 'right') this.sprite.scale.x *= -1;
}

//returns the snails game.body. Used for collision detection
Snail.prototype.getSprite = function()
{
    return this.sprite;
};

//returns true if snail is alive
Snail.prototype.isAlive = function() {
    return this.alive;
}

//damages the snail// returns score if killed
Snail.prototype.takeDamage = function() {
    this.health = this.health - 1;
    //if the snail has 0 or less health it's dead
    if(this.health <= 0){
        this.alive = false; //set to false
        this.sprite.kill(); //kill the sprite
        return this.scoreVaulue; //return the score value
    }
    return 0; //not killed, no score increase
}

//snail is a basic enemy that does'nt react to the player
Snail.prototype.move = function()
{
    var collided;//variable to hold if collision with platform happened
    var i = -1;//ensure starts at 0

    //loop finds the platform that the snail is on if on any
    do{
        i++;//increment i
        collided = game.physics.arcade.collide(this.sprite, platforms.children[i]); //check for collision
    } while(i < platforms.children.length && collided == false); //only exit when collision happened or no more platforms

    //if direction is left move left
    if(collided == true) {
        if (this.direction == 'left') {
            this.sprite.body.velocity.x = -30;

        } else {
            //else move right
            this.sprite.body.velocity.x = 30;
        }
    }

    //if the direction changes flip the image
    if(this.direction != this.oldDirection) {
        this.sprite.scale.x *= -1; //flip the image horizontally
        this.oldDirection = this.direction; //set old direction to direction
    }

    //if snail goes off screen at the bottom kill it
    if( this.sprite.position >= 600 ){
        this.alive = false;
        this.sprite.Kill();
    }
};

//returns the score if the snail is dead
Snail.prototype.checkBulletCollision = function(){
    var score = 0;
    //check the collision of the snail with each bullet
    for(var j = bullets.children.length; j >= 0; j--)
    {
        //no point checking if the snail is dead
        if(this.alive == true) {
            //check collision
            if (game.physics.arcade.collide(bullets.children[j], this.sprite)) {
                //if collided kill the bullet
                bullets.children[j].kill();
                //snail takes damage //return damage
                score = this.takeDamage();

            }
        }
    }
    return score;
};

Snail.prototype.checkPlayerCollision = function (){
    //check collision
    if (game.physics.arcade.collide(player, this.sprite)) {
        //bounce the player back
        player.body.velocity.x = -150;
        player.body.velocity.y = -150;

        //lower the health of the player
        health -= 10;

        //no score if snail dies after touching player
        this.takeDamage();
    }//end if
};

//end of Snail class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////