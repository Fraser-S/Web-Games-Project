/**
 * Created by B00251398 on 31/01/2017.
 */
var Game = function(game) {};



Game.prototype = {
    preload :preload,
    create :create,
    update: update

};

function preload() {

    game.load.image("hercules","Assets/hercules.png");
    game.load.image('bullet', 'Assets/bullet.png');
    game.load.image('mag', 'Text/Mag.png');
    game.load.image("antenna", "Assets/antenna.png");
    game.load.audio("noAmmoSound","Audio/noAmmoSound.wav");
    game.load.audio("reloadSound","Audio/reloadSound.wav");
    game.load.audio("shootSound","Audio/shootSound.wav");
}

var player, bullets, cursors, pauseButton, magText, reloadButton, antenna, message1Text;

var fireRate = 100;
var nextFire = 0;
var mag = 50;


var noAmmoSound, reloadSound, shootSound;

var allowNoAmmo = true;
var allowFire = true;


function create(){


    antenna = game.add.sprite(100,570,"antenna");
    game.physics.arcade.enable(antenna);

    // assigns the sounds used in the game to variables so they can be called
    noAmmoSound = game.add.audio("noAmmoSound");
    reloadSound = game.add.audio("reloadSound");
    shootSound = game.add.audio("shootSound");
    var magTitle = this.game.add.sprite(0,0, "mag", this);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(32, 200, 'hercules');

    game.physics.arcade.enable(player);

    player.body.bounce.setTo(0.4);
    player.body.gravity.setTo(0, 400);
    player.body.collideWorldBounds = true;
    //makes the camera follow the player
    game.camera.follow(player);


    // player input
    cursors = game.input.keyboard.createCursorKeys();
    pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    reloadButton = game.input.activePointer.middleButton;
    //

    // create bullet group for the player to shoot with
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    magText = game.add.text(70, 3, '' + mag, {fontSize: '15px', fill: '#FF0000'});
    message1Text = game.add.text(400, 32, 'hey', { fontSize: "15px", fill: "#19de65" });


}

function update() {

    if (message1(antenna, player))
    {
        message1Text.text = 'Hey there';
    } else
    {
     message1Text.text = "";
    }

    player.body.velocity.x = 0;

    // calls reload function when r is pressed
    reloadButton.onDown.add(reloadDelay, this);
    // calls pause function when p is pressed
    pauseButton.onDown.add(pauseFunction, this);

    // Player Movement
    if (cursors.left.isDown) {
        //  Move the player to the left
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown) {
        //  Move the player to the right
        player.body.velocity.x = 300;
    }

    if (cursors.up.isDown && player.body.onFloor()) {
       // allow the player to jump if they are touching the ground
        player.body.velocity.y = -350;
    }

    // allows the player to shoot by calling the fire function when the left mouse button is clicked
    if (game.input.activePointer.leftButton.isDown)
    {
        fire();
    }

}
// function allows the player to shoot if they have bullets avalaible. Will also play shooting sound and update the ammo count
function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0 && mag >0 && allowFire == true)
    {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstDead();
        bullet.reset(player.x + 8, player.y - 4);
        game.physics.arcade.moveToPointer(bullet, 800);
        shootSound.play();
        mag -= 1;
        magText.text = '' + mag;

    }

//stops the player from shooting when they have no ammo and plays the empty clip sound when they attempt to shoot
    if(mag == 0 && allowNoAmmo == true){
        noAmmoSound.play();
        allowNoAmmo = false;
        game.time.events.add(Phaser.Timer.SECOND * 1, playNoAmmo, this);
    }

}

// this function creates a delay before calling the reload function. This function also prevents the player from shooting during the reload process
function reloadDelay() {

    if(mag < 50)
    {
        allowFire = false;
        reloadSound.play();
        game.time.events.add(Phaser.Timer.SECOND * 1, reload, this);
    }


}

// this function resets the magazine back to full capacity, changes the text to the new number and allows the player to fire
function reload() {
    mag = 50;
    magText.text = '' + mag;
    allowFire = true;

}


// this function pauses the game
function pauseFunction(){
    game.paused = !game.paused
}

// boolean used to prevent the player from shooting while they are reloading
function playNoAmmo(){
    allowNoAmmo = true;
}

function message1(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}