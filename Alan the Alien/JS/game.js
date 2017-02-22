/**
 * Created by B00251398 on 21/02/2017.
 */
var Game = function(game) {};



Game.prototype = {
    preload :preload,
    create :create,
    update: update

};

function preload(){

    game.load.image('alan', 'Assets/alan.jpg');
    game.load.image('bullet', 'Assets/Bullet.png');
    game.load.image('mag', 'Text/Mag.png');
    game.load.image('scoreTitle', 'Text/scoreTitle.png');
    game.load.image('floor', 'Assets/ground.png');
    game.load.image('pickup', 'Assets/pointpickup.png');

}

var player, bullets, cursors, pauseButton, magText, magTitle, reloadButton, shootButton, scoreTitle, deathText, platforms, pickups, scoreText;

var fireRate = 100;
var nextFire = 0;
var mag = 10;
var score = 0;

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

    //create text that informs the player they have died
    deathText = game.add.text(0, 0, "", {fontSize: '20px', fill: '#000000'})
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


    //player settings
    player = game.add.sprite(32, 200, 'alan');
    game.physics.arcade.enable(player);
    player.body.bounce.setTo(0.6);
    player.body.gravity.setTo(0, 200);
    player.body.collideWorldBounds = true;
    //makes the camera follow the player
    game.camera.follow(player);

    // player input
    cursors = game.input.keyboard.createCursorKeys();
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
    var touchPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, pickups, function killPickups(player,pickup) {
        score += 100;
        scoreText.text = '' + score;
        pickup.kill();
    });
    game.physics.arcade.collide(bullets, platforms, function killBullets(bullet) {
        bullet.kill();
    });

    deathText.x = Math.floor(player.x - 100)
    deathText.y = Math.floor(player.y - 200)




    player.body.velocity.x = 0;

    // calls reload function when r is pressed
    reloadButton.onDown.add(reloadBreak, this);
    // calls pause function when p is pressed
    pauseButton.onDown.add(pauseFunction, this);

    // Player Movement left right and jumping
    if (cursors.left.isDown) {
        //  Move the player to the left
        player.body.velocity.x = -150;
        aimLeft = true;
        aimRight = false;
    }
    else if (cursors.right.isDown) {
        //  Move the player to the right
        player.body.velocity.x = 150;
        aimRight = true;
        aimLeft = false
    }

    if (cursors.up.isDown && player.body.touching.down  && touchPlatform == true) {
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
        bullet.reset(player.x + 4, player.y - 2);
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

    deathText.text = "You Died, You will Respawn in 3 seconds"
}

function respawnPlayer(x,y) {
    deathText.text = "";
    score =- 100;
    scoreText.text = "" + score;
    player.reset(x,y);
    player.revive();
    playerDead = false;

}