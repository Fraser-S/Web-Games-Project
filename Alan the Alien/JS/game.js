/**
 * Created by B00251398 on 21/02/2017.
 *
 */

var Game = function(game) {};

Game.prototype = {
    preload : preload,
    create : create,
    update : update

};

function preload(){
    game.load.spritesheet('player', 'Assets/Alan.png', 22, 21);
    game.load.image('exit', 'Assets/exit.png');
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
    game.load.image('turret', 'Assets/turret.png');
}

var player, bullets, jumpButton, leftButton, rightButton, pauseButton, magText, magTitle, reloadButton, shootButton, scoreTitle, alertText, pickups, scoreText, healthHud,
    healthHearts, heart1, heart2, heart3, healthkit, map, map2, map3, map4, backmap, backmap2, backmap3, backmap4, layer, layer2, layer3, layer4,
    backgroundLayer1, backgroundLayer2, backgroundLayer3, backgroundLayer4, exit1, exit2, exit3, spike, snails, turrets, aiBullets;

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
var playingLevel1 = true;
var playingLevel2 = false;
var playingLevel3 = false;
var playingLevel4 = false;
var checkpoint1 = false;
var checkpoint2 = false;
var checkpoint3 = false;




function setLevel(playerx, playery, healthkitx, healthkity, pickup1x, pickup1y, pickup2x,pickup2y,pickup3x,pickup3y){

    player = game.add.sprite(playerx, playery, 'player');
    game.physics.arcade.enable(player);
    player.body.bounce.setTo(0.2);
    player.body.gravity.setTo(0, 100);
    player.body.collideWorldBounds = true;
    //makes the camera follow the player
    game.camera.follow(player);

    player.animations.add('right', [0, 1], 10, true);
    player.animations.add('left', [3, 4], 10, true);

    healthkit = game.add.sprite(healthkitx, healthkity, 'fullHeart');
    game.physics.arcade.enable(healthkit);
    healthkit.enableBody = true;
    healthkit.body.gravity.y = 100;

    pickups = game.add.group();
    pickups.enableBody = true;
    var pickup1 = pickups.create(pickup1x, pickup1y,'pickup');
    pickup1.body.gravity.y = 100;
    pickup1.body.bounce.y = 0.3
    var pickup2 = pickups.create(pickup2x, pickup2y,'pickup');
    pickup2.body.gravity.y = 100;
    pickup2.body.bounce.y = 0.3
    var pickup3 = pickups.create(pickup3x, pickup3y,'pickup');
    pickup3.body.gravity.y = 100;
    pickup3.body.bounce.y = 0.3;


    // create bullet group for the player to shoot with
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(10, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

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

}


function create() {

    game.stage.backgroundColor = "#000000";

    map = game.add.tilemap('level1');
    map.addTilesetImage('AlanSpriteSheet', 'tiles');

    map2 = game.add.tilemap('level2');
    map2.addTilesetImage('AlanSpriteSheet', 'tiles');

    map3 = game.add.tilemap('level3');
    map3.addTilesetImage('AlanSpriteSheet', 'tiles');

    map4 = game.add.tilemap('bossLevel');
    map4.addTilesetImage('AlanSpriteSheet', 'tiles');

    backmap2 = game.add.tilemap('back2');
    backmap2.addTilesetImage('backgrounds', 'backgrounds');

    backmap3 = game.add.tilemap('back3');
    backmap3.addTilesetImage('backgrounds', 'backgrounds');

    backmap4 = game.add.tilemap('bossBack');
    backmap4.addTilesetImage('backgrounds', 'backgrounds');

    backmap = game.add.tilemap('back1');
    backmap.addTilesetImage('backgrounds', 'backgrounds');

    backgroundLayer1 = backmap.createLayer('Background');
    layer = map.createLayer('Foreground');
    layer.resizeWorld();

    map.setCollisionBetween(0,150);
    map.setCollisionBetween(154,199);
    map.setCollisionBetween(205,233);

    setLevel(32, 350, 400, 32, 85, 0, 500,0,1900,200);


    exit1 = game.add.sprite(2050, 32, 'exit');
    game.physics.arcade.enable(exit1);
    exit1.body.gravity.setTo(0, 100);


    // player input
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
    reloadButton = game.input.keyboard.addKey(Phaser.Keyboard.R);


    //create the enemy arrays
    snails = [];
    turrets = [];
    setLevel1Enemies();

    aiBullets = [];
}


//set the enemies for level 1, no turrets
function setLevel1Enemies(){
    //snails
    snails.push(new Snail(game.add.sprite(200, 400,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(400, 150,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(480, 150,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(624, 294,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(845, 168,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1166, 64,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1507, 420,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1663, 336,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1593, 273,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1403, 168,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1506, 126,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1742, 62,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1940, 62,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(423, 399,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(37, 273,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(83, 149,'snail'), "right"));
}

function update() {

    //output player position/ easier tyo place stuff
    console.log("X: " + player.position.x + ",   Y: " + player.position.y);

    //update the ai
    updateEnemies();

    //check collisions
    checkCollisions();

    //checks if the player has enough health to live
    checkHealth();

    //player controls
    playerControl();

    //kills the player if the fall off the bottom of the map this code is specific to each level
    if(playingLevel1 == true){
        if(player.x > 1000){
            checkpoint1 = true;
        }
        if (player.y > 540 && checkpoint1 == false){
            killPlayer(32,400);
        }else {
            if (player.y > 540 && checkpoint1 == true){
                killPlayer(1000,400)
            }
        }
    }
    else if (playingLevel2 == true){

        if(player.x > 1659 && player.y> 735){
            checkpoint2 = true;
        }


        if(player.y> 960 && checkpoint2 == false){
            killPlayer(32,50)
        }else if (player.y > 960 && checkpoint2 == true){
            killPlayer(1660,700)
        }
    }
    if(playingLevel3 == true){

        if(player.x > 777){
            checkpoint3 = true;
        }

        if (player.y > 540 && checkpoint3 == false){
            killPlayer(32,32);
        }else if (player.y > 540 && checkpoint3 == true){
            killPlayer(777,400)
        }
    }
}

//player controls
function playerControl(){
    //reset the players velocity to zero so that one key press doesn't move the player constantly in the direction pressed
    player.body.velocity.x = 0;

    // calls reload function when r is pressed
    reloadButton.onDown.add(reloadBreak, this);
    // calls pause function when p is pressed
    pauseButton.onDown.add(pauseFunction, this);

    // Player Movement left, right and jumping
    if (leftButton.isDown) {
        //  Move the player to the left
        player.body.velocity.x = -100;
        aimLeft = true;
        aimRight = false;
        player.animations.play('left');
    }
    else if (rightButton.isDown) {
        //  Move the player to the right
        player.body.velocity.x = 100;
        aimRight = true;
        aimLeft = false
        player.animations.play('right');
    }else{
        player.frame = 2;
    }
    if (jumpButton.isDown && player.body.onFloor()) {
        player.body.velocity.y = -125;
    }


    // allows the player to shoot by calling the fire function when the player presses the spacebar
    //depending on where the player is facing a different variable will be passed through to change where the bullet is fire to
    if (shootButton.isDown && aimRight == true)
    {
        playerFires(shootRight);
    }

    if (shootButton.isDown && aimLeft == true){

        playerFires(shootLeft)
    }
}

// function that checks the
function checkCollisions(){
    //all collision code is detailed in this section of code //performs a prior check before hand to prevent unnessisery checks
    //level 1 specific code
    if(playingLevel1 == true) {
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(healthkit, layer);
        game.physics.arcade.collide(pickups, layer);
        game.physics.arcade.collide(exit1, layer);

        game.physics.arcade.collide(bullets, layer, function (bullets) {
            bullets.kill();
        });

        game.physics.arcade.overlap(player, exit1, function () {
            exit1.kill();
            level2();
        });
    }

    //level 2 specific code////////////////////////////////////////////////////////////////////
    if(playingLevel2 == true) {
        game.physics.arcade.collide(player, layer2);
        game.physics.arcade.collide(healthkit, layer2);
        game.physics.arcade.collide(pickups, layer2);
        game.physics.arcade.collide(exit2, layer2);


        game.physics.arcade.collide(bullets, layer2, function (bullets) {

            bullets.kill();
        });

        game.physics.arcade.overlap(player, exit2, function () {
            exit2.kill();
            level3();
        });
    }

    //Level 3///////////////////////////////////////////////////////////////////////////////////
    if(playingLevel3 == true) {
        game.physics.arcade.collide(player, layer3);
        game.physics.arcade.collide(healthkit, layer3);
        game.physics.arcade.collide(pickups, layer3);
        game.physics.arcade.collide(exit3, layer3);

        game.physics.arcade.collide(bullets, layer3, function (bullets) {

            bullets.kill();
        });

        game.physics.arcade.overlap(player, exit3, function () {
            exit3.kill();
            level4();
        });
    }

    //Boss level/////////////////////////////////////////////////////////////////////////////////////
    if(playingLevel4 == true) {
        game.physics.arcade.collide(player, layer4);
        game.physics.arcade.collide(pickups, layer4);
        game.physics.arcade.collide(bullets, layer4, function (bullets) {

            bullets.kill();
        });
    }

    //general collision code///////////////////////////////////////////////////////////////////////////////
    game.physics.arcade.overlap(player, pickups, function (player, pickup) {

        pickup.kill();
        score += 100;
        scoreText.text = '' + score;

    });

    game.physics.arcade.overlap(player, healthkit, function (player, healthkit) {

        healthkit.kill();
        if(health < 40){
            health += 20;
        }else{
            health = 60;
        }
    });
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

//this function kills the player sprite displays a message and calls the respawn function
function killPlayer(x,y) {
    playerDead = true;
    player.kill();
    game.time.events.add(Phaser.Timer.SECOND * 1, respawnPlayer, this, x, y);

    alertText.text = "You Died"
}

//respawns the player in the correct position and gives them full health
function respawnPlayer(x,y) {
    alertText.text = "";
    player.reset(x,y);
    player.revive();
    playerDead = false;
    health = 60;
    mag = 10;
    magText.text = '' + mag

}

//checks the health of the player can changes the health hud to show the players health
function checkHealth() {
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

        if(playingLevel1 == true){
            if(checkpoint1 == true) {
                killPlayer(1000, 400);
            }else{
                killPlayer(32,350);
            }
        }else if(playingLevel2 == true){
            if(checkpoint2 == true) {
                killPlayer(1660, 700);
            }else{
                killPlayer(32,50);
            }
        }else if(playingLevel3 == true){
            if(checkpoint3 == true) {
                killPlayer(777, 400);
            }else{
                killPlayer(32,50);
            }
        }else if(playingLevel4 == true){
            killPlayer(32,50);
        }
    }
}

//this function sets level 2 up so that the player can play it
function level2() {
    emptyEnemyArrays();

    layer.kill();
    backgroundLayer1.kill();
    backgroundLayer2 = backmap2.createLayer('Background');
    layer2 = map2.createLayer('Foreground');
    layer2.resizeWorld();

    player.destroy();
    healthkit.destroy();
    pickups.destroy();

    playingLevel1 = false;
    playingLevel2 = true;
    playingLevel3 = false;


    exit2 = game.add.sprite(12, 350, 'exit');
    game.physics.arcade.enable(exit2);
    exit2.body.gravity.setTo(0, 100);

    map2.setCollisionBetween(0,150);
    map2.setCollisionBetween(154,199);
    map2.setCollisionBetween(205,233);

    setLevel(60, 32, 1600, 400, 700, 400, 1000,700,200,1000)

    //add the ai
    spawnLevel2AI();
}

//spawn the ai for the second level
function spawnLevel2AI(){
    //add the ai
    snails.push(new Snail(game.add.sprite(960, 80,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(668, 441,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(204, 420,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(308, 924,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(562, 735,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(833, 609,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1019, 756,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1655, 735,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1040, 483,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(305, 189,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(460, 231,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(653, 105,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1301, 294,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1351, 294,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1094, 294,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1202, 189,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1262, 126,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1443, 62,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1772, 231,'snail'), "right"));
    //turrets
    turrets.push(new Turret(game.add.sprite(42, 609,'turret'), 350));
    turrets.push(new Turret(game.add.sprite(759, 567,'turret'), 350));
    turrets.push(new Turret(game.add.sprite(2005, 231,'turret'), 350));
}

//this function sets level 3 up so that the player can play it
function level3() {
    emptyEnemyArrays();
    layer2.kill();
    backgroundLayer2.kill();
    backgroundLayer3 = backmap3.createLayer('Background');
    layer3 = map3.createLayer('Foreground');
    layer3.resizeWorld();

    player.destroy();
    healthkit.destroy();
    pickups.destroy();


    playingLevel1 = false;
    playingLevel2 = false;
    playingLevel3 = true;

    exit3 = game.add.sprite(2000, 450, 'exit');
    game.physics.arcade.enable(exit3);
    exit3.body.gravity.setTo(0, 100);

    map3.setCollisionBetween(0,150);
    map3.setCollisionBetween(154,199);
    map3.setCollisionBetween(205,233);

    setLevel(32, 50, 1300, 50, 75, 150, 600,30,1000,50);

    spawnLevel3AI();
}

//spawn the ai for the second level
function spawnLevel3AI(){
    //snails
    snails.push(new Snail(game.add.sprite(1911, 63,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1618, 42,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1438, 42,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1283, 63,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1128, 42,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(931, 42,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1734, 189,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1729, 357,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1389, 483,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1485, 483,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1489, 420,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1320, 420,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1339, 357,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1453, 357,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1379, 231,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1339, 168,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1233, 168,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1224, 231,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1227, 231,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1124, 294,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1124, 294,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1047, 357,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(867, 399,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(1022, 420,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1179, 420,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(939, 483,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(1217, 483,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(60, 399,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(0, 210,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(627, 89,'snail'), "right"));
    snails.push(new Snail(game.add.sprite(631, 231,'snail'), "left"));
    snails.push(new Snail(game.add.sprite(641, 378,'snail'), "left"));

    //turrets
    turrets.push(new Turret(game.add.sprite(872, 126,'turret'), 350));
    turrets.push(new Turret(game.add.sprite(1673, 126,'turret'), 350));
}


function level4() {
    emptyEnemyArrays();
    layer3.kill();
    backgroundLayer3.kill();
    backgroundLayer4 = backmap4.createLayer('Background');
    layer4 = map4.createLayer('Foreground');
    layer4.resizeWorld();

    player.reset(32,50);

    healthkit.reset(1000,50);

    playingLevel1 = false;
    playingLevel2 = false;
    playingLevel3 = false;
    playingLevel4 = true;

    pickups.destroy();
    pickups = game.add.group();
    pickups.enableBody = true;

    map4.setCollisionBetween(0,150);
    map4.setCollisionBetween(154,199);
    map4.setCollisionBetween(205,233);

    setLevel(32, 50, 1000, 50, 300, 200, 600,200,900,200);

};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateEnemies() {
    //update the snails
    for(var i = 0; i < snails.length; i++){
        //move the snail
        score += snails[i].update();
    }//next snail

    //now that it is out of the loop remove the dead snails
    for(var i = snails.length -1; i >= 0; i--){
        //if snail is dead remove it
        if(snails[i].isAlive() == false){
            snails.splice(i, 1);
        }
    }

    //update the turrets
    for(var i = 0; i < turrets.length; i++){
        //update the turrets
        turrets[i].update();

        //check collisions
        turrets[i].checkCollision();
        score += turrets[i].checkBulletCollision();
        //check player collision
        if(turrets[i].isAlive() == true) turrets[i].checkPlayerCollision();

    }//next turret

    //now that it is out of the loop remove the dead turrets
    for(var i = turrets.length -1; i >= 0; i--){
        //if turret is dead remove it
        if(turrets[i].isAlive() == false){
            turrets.splice(i, 1);
        }
    }

    //update the aiBullets
    for(var i = 0; i < aiBullets.length; i++){
        //update the aiBullets
        aiBullets[i].update();
        //check collisions
        aiBullets[i].checkCollision();
    }//next aiBullet

    //now that it is out of the loop remove the dead aiBullets
    for(var i = aiBullets.length -1; i >= 0; i--){
        //if aiBullets is dead remove it
        if(aiBullets[i].isAlive() == false){
            aiBullets.splice(i, 1);
        }
    }

    //update the score
    scoreText.text = '' + score;
}

function emptyEnemyArrays(){
    //remove the snails
    for(var i = snails.length -1; i >= 0; i--){
        snails[i].killSnail();//removes the sprite
        snails.splice(i, 1);
    }

    //remove the turrets
    for(var i = turrets.length -1; i >= 0; i--){
        turrets[i].killTurret();//removes the sprite
        turrets.splice(i, 1);
    }

    //remove the aiBullets
    for(var i = aiBullets.length -1; i >= 0; i--){
        aiBullets[i].killBullet();//removes the sprite
        aiBullets.splice(i, 1);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Functions used by multiple enemies

//check to see if the player is in range with a sprite
//not tied to a single Enemy so it can be reused
function playerInRange(sprite, detectionRange) {
    //get the difference in x and y then square it add them then take the square root
    var xDif = player.position.x - sprite.x;
    var yDif = player.position.y - sprite.y;

    //check to see if the player is closer than the detection range
    if(Math.sqrt((xDif*xDif)+(yDif*yDif)) <= detectionRange)
    {
        return true;//return true if player is closer
    }
    return false;//return false if not.
}

//returns true if the sprite collides with the ground
function collideWithGround(sprite) {
    //level 1
    if(playingLevel1 == true){
        if(game.physics.arcade.collide(layer, sprite) == true) {
            return true;
        }
    } else {
        //level 2
        if (playingLevel2 == true) {
            if (game.physics.arcade.collide(layer2, sprite) == true) {
                return true;
            }
        } else {
            //level 3
            if (playingLevel3 == true) {
                if (game.physics.arcade.collide(layer3, sprite) == true) {
                    return true;
                }
            } else {
                //level 4
                if (playingLevel4 == true) {
                    if (game.physics.arcade.collide(layer4, sprite) == true) {
                        return true;
                    }
                } //end if level 4
            } //end if level 3
        } //end if level 2
    }//end if level 1

    //return false
    return false;
}

//check to see if the sprite falls to the bottom of the map
function checkHitBottomOfMap(sprite) {
    //check for each level, return true if hit the bottom of the current level
    if(playingLevel1 == true){
        if(sprite.position.y >= 540) {
            return true;
        }
    } else {
        if (playingLevel2 == true) {
            if(sprite.position.y >= 961) {
                return true;
            }
        } else {
            if (playingLevel3 == true) {
                if(sprite.position.y >= 545) {
                    return true;
                }
            } else {
                if (playingLevel4 == true) {
                    if(sprite.position.y >= 540) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

//end of Functions used by multiple enemies
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Snail class and functions

//constructor and data storage
function Snail(sprite, direction) {
    //add the variables
    this.sprite = sprite; //snail sprite
    this.direction = direction; //snail direction
    this.lastPosition = this.sprite.position.x; //lastPosition is used to change diurection when ai is hitting a wall

    this.state = "patrol"; //will be used for adding a random behaviour to it
    this.scoreVaulue = 50; //how much the enemy is worth when killed
    this.health = 2; //health of the enemy
    this.alive = true; //true = alive, false = dead
    this.gravity = 100; //used to allow the snail to fall
    this.onPlatform = false;
    this.maximumDistanceToPlayer = 100; //used to decide when to fall
    //setup other values - physics stuff
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.y = this.gravity;

    //sprite stuff
    this.sprite.anchor.setTo(0.5,0.5);
    //check direction - flip for enemies going right
    if(this.direction == 'right') this.sprite.scale.x *= -1;
}

//returns the snails game.body. Used for collision detection
Snail.prototype.getSprite = function() {
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

Snail.prototype.update = function(){
    score = 0;
    //check for collisions and if collided move
    this.checkPlatformCollisions();

    //check collision with bullets
    score = this.checkBulletCollision();

    //check collision with player
    this.checkPlayerCollision();

    //move the snail
    this.move(false);

    return score;
};

//snail is a basic enemy that does'nt react to the player
Snail.prototype.move = function(wallHit) {

    if (this.direction == 'left') {
        this.sprite.body.velocity.x = -30;
    } else {
        //else move right
        this.sprite.body.velocity.x = 30;
    }

    //if snail goes off screen at the bottom kill it
    if(checkHitBottomOfMap(this.sprite) == true) {
        this.killSnail();
    }

    //check if on platform and hasnt moved form last position. wallHit ensures that it does not keep looping round
    if(this.onPlatform == true && this.sprite.position.x == this.lastPosition && wallHit == false)
    {
        this.changeDirection();
        this.move(true);
        this.lastPosition = this.sprite.position.x+1;
    } else {
        this.lastPosition = this.sprite.position.x;
    }

};

Snail.prototype.changeDirection = function(){
    if (this.direction == 'left') {
        this.direction = 'right';
        this.sprite.scale.x *=  -1; //flip the image horizontally
    } else {
        //else move right
        this.direction = 'left';
        this.sprite.scale.x *= -1; //flip the image horizontally
    }
};

Snail.prototype.checkPlatformCollisions = function(){
    //used to store if collision happened or not
    var collided = false;

    if(playingLevel1 == true){
        collided = game.physics.arcade.collide(this.sprite, layer); //check for collision
        if(collided == true){
            this.onPlatform = true;
        }
    } else {
        //level 2
        if (playingLevel2 == true) {
            collided = game.physics.arcade.collide(this.sprite, layer2); //check for collision
            if(collided == true){
                this.onPlatform = true;
            }
        } else {
            //level 3
            if (playingLevel3 == true) {
                collided = game.physics.arcade.collide(this.sprite, layer3); //check for collision
                if(collided == true){
                    this.onPlatform = true;
                }
            } else {
                //level 4
                if (playingLevel4 == true) {
                    collided = game.physics.arcade.collide(this.sprite, layer4); //check for collision
                    if(collided == true){
                        this.onPlatform = true;
                    }
                } //end if level 4
            } //end if level 3
        } //end if level 2
    }//end if level 1

    //if on platform and no collision occurred turn around
    if(this.onPlatform == true && collided == false)
    {
        //check to see if the snail should fall
        if(this.fallCheck() == true){
            //no longer on platform
            this.onPlatform = false;
        } else {
            //if the player is not in range, change direction
            this.changeDirection();
        }
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
        if(player.position.x < this.sprite.position.x) {
            player.body.velocity.x = -200;
            player.body.velocity.y = -150;
        } else {
            player.body.velocity.x = 200;
            player.body.velocity.y = -150;
        }

        //lower the health of the player
        health -= 10;

        //no score if snail dies after touching player
        this.takeDamage();
    }//end if
};

Snail.prototype.killSnail = function() {
    this.alive = false; //set to false
    this.sprite.kill(); //kill the sprite
};

//used to check if the snail should fall
Snail.prototype.fallCheck = function(){
    if(playerInRange(this.sprite, this.maximumDistanceToPlayer) == true) {
        //check if the snail is below the snail
        if (player.position.y > this.sprite.position.y) {
            //check the position and direction
            if ((player.position.x > this.sprite.position.x && this.direction == "right") || (player.position.x < this.sprite.position.x && this.direction == "left")) {
                return true;//return true
            } //final check position and direction
        } //second check, height
    }//first check, distance

    return false;
};

//end of Snail class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Turret Class
function Turret(sprite, detectionRange) {
    //add the variables
    this.sprite = sprite; //turret sprite
    this.sprite.scale.setTo(0.5,0.5);
    this.detectionRange = detectionRange; //the range that the turret will react to the player
    this.state = "idle"; //used to determine between active and inactive
    this.scoreVaulue = 100; //how much the enemy is worth when killed
    this.health = 5; //health of the enemy
    this.alive = true; //true = alive, false = dead
    this.gravity = 300; //used to allow the turret to fall //ensures that it is on the ground
    this.timeBetweenShot = 1200;//1.2s between shots
    this.lastFired = 0;

    //used for the turrets special attacks
    this.specialAttackActive = false; //stores if the special attack is active
    this.minimumTimeBetweenSpecials = 5000;
    this.timeSpecialEnded = 0; //used to store when the last special ended
    this.specialAttackAttackSpeed = this.timeBetweenShot/2; //faster firing when special attack enabled
    this.maxShots = 10; //max shots of the special attack
    this.shotsFired = 0; //number of shots fired
    this.shotStep = 180 / this.maxShots; //angle to increase by for the next shot
    this.currentSpecialAttack = "none";
    this.angle = 0;
    //setup other values - physics stuff
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.y = this.gravity;

    //sprite stuff
    this.sprite.anchor.setTo(0.5,0.5);
    //check direction - flip for enemies going right
    if(this.direction == 'right') this.sprite.scale.x *= -1;
}

//update the turret
Turret.prototype.update = function() {
    //if the special attack is not active
    if(this.specialAttackActive == false)
    {
        //if the player is in range set to "firing"
        if(playerInRange(this.sprite, this.detectionRange) == true) {
            this.state = "firing";
        } else {
            this.state = "idle";
        }

        //see if the special attack is going to trigger
        if(game.time.now >= this.minimumTimeBetweenSpecials + this.timeSpecialEnded &&this.specialAttackActive == false) {
            this.activateSpecial();
        }
    }

    //only fire if a special attack is active or the turret is firing
    if(this.specialAttackActive == true || this.state == "firing")
    {
        //see if the current attack is aimed or random
        if( this.currentSpecialAttack == "spreadFire"){
            //spread fire
            this.spreadFire();
        }else{
            //shoot at player
            this.fire();
        }
    }
};

//using random number generator activate a special attack
Turret.prototype.activateSpecial = function() {
    //get random number
    var randomNum = Math.floor((Math.random() * 10) + 1);

    //if divisible by 3 with no remainder activate the special attack
    if(randomNum % 3 === 0)
    {
        //activate the special attack
        this.specialAttackActive = true;

        //depending on the turrets state activate a specific attack
        if(this.state == "firing")
        {
            //if the turret is firing increase fire rate for a few shots
            this.currentSpecialAttack = "rapidFire";
        } else {
            //if the turret is idle fire in an arc
            this.currentSpecialAttack = "spreadFire";//"spreadFire";
        }
    } else {
        //add another delay
        this.timeSpecialEnded = game.time.now; //set to current time
    }
};

Turret.prototype.spreadFire = function() {
    if(this.specialAttackActive == true && game.time.now > this.lastFired + this.specialAttackAttackSpeed){
        //get the angle between the player and the turret
        this.angle += this.shotStep;
        //get the horizontal speed of the shot
        var xVel = Math.cos(this.angle*0.0174533) * 400; //0.0174533 is for converting it to radians
        //get the vertical speed of the bullet
        var yVel = Math.sin(this.angle*0.0174533) * -400;

        //create the bullet
        aiBullets.push(new DirectedBullet(game.add.sprite(this.sprite.position.x, this.sprite.position.y,'bullet'), xVel, yVel));

        //add 1 to bullet and check if fired all shells
        //increase shots fired
        this.shotsFired++;
        //if all shots fired return to normal
        if(this.shotsFired >= this.maxShots) {
            this.shotsFired = 0;//set shots fired to 0
            this.angle = 0;
            this.currentSpecialAttack = "none"; //set current to none
            this.specialAttackActive = false; //set special attack to false
            this.timeSpecialEnded = game.time.now; //set to current time
        }


        //get the time so the shot is delayed
        this.lastFired = game.time.now;
    }
};

Turret.prototype.fire = function() {
    if((this.specialAttackActive == false && game.time.now > this.lastFired + this.timeBetweenShot) || //normal fire mode
        (this.specialAttackActive == true && game.time.now > this.lastFired + this.specialAttackAttackSpeed)) //rapid fire
    {
        //get the angle between the player and the turret
        var angle = game.physics.arcade.angleBetween(this.sprite.position, player.position);
        //get the horizontal speed of the shot
        var xVel = Math.cos(angle) * 400;
        //get the vertical speed of the bullet
        var yVel = Math.sin(angle) * 400;

        //create the bullet
        aiBullets.push(new DirectedBullet(game.add.sprite(this.sprite.position.x, this.sprite.position.y,'bullet'), xVel, yVel));

        //add 1 to bullet and check if fired all shells
        if(this.specialAttackActive == true)
        {
            //increase shots fired
            this.shotsFired++;
            //if all shots fired return to normal
            if(this.shotsFired >= this.maxShots) {
                this.shotsFired = 0;//set shots fired to 0
                this.currentSpecialAttack = "none"; //set current to none
                this.specialAttackActive = false; //set special attack to false
                this.timeSpecialEnded = game.time.now; //set to current time
            }
        }

        //get the time so the shot is delayed
        this.lastFired = game.time.now;
    }
};

//check the collision with the ground
Turret.prototype.checkCollision = function(){
    if(collideWithGround(this.sprite) == true){
        this.sprite.body.moves = false;
    }
};

//return true if the bullet is alive
Turret.prototype.isAlive = function(){
    //update the x and y position
    return this.alive;
};

//returns the score if the turret is dead
Turret.prototype.checkBulletCollision = function(){
    var score = 0;
    //check the collision of the turret with each bullet
    for(var j = bullets.children.length; j >= 0; j--)
    {
        //no point checking if the turret is dead
        if(this.alive == true) {
            //check collision
            if (game.physics.arcade.collide(bullets.children[j], this.sprite)) {
                //if collided kill the bullet
                bullets.children[j].kill();
                //turret takes damage //return damage
                score = this.takeDamage();
            }
        }
    }
    return score;
};

Turret.prototype.checkPlayerCollision = function (){
    //check collision
    if (game.physics.arcade.collide(player, this.sprite)) {
        //bounce the player back
        player.body.velocity.x = -150;
        player.body.velocity.y = -150;

        //lower the health of the player
        health -= 10;

        //no score if turret dies after touching player
        this.takeDamage();
    }//end if
};

//damages the turret// returns score if killed
Turret.prototype.takeDamage = function() {
    this.health = this.health - 1;
    //if the turret has 0 or less health it's dead
    if(this.health <= 0){
        this.killTurret();
        return this.scoreVaulue; //return the score value
    }
    return 0; //not killed, no score increase
}

Turret.prototype.killTurret = function() {
    this.alive = false; //set to false
    this.sprite.kill(); //kill the sprite
};

//end of Turret class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DirectedBullet Class
function DirectedBullet(sprite, xSpeed, ySpeed) {
    //add the variables
    this.sprite = sprite; //bullet sprite
    this.xSpeed = xSpeed; //the horizontal speed of the bullet
    this.ySpeed = ySpeed; //the vertical speed of the bullet
    this.alive = true;

    game.physics.arcade.enable(this.sprite);
}

DirectedBullet.prototype.update = function() {
    //move
    this.move();
    //check if the bullet is off screen

};

//update the bullets position
DirectedBullet.prototype.move = function(){
    //update the x and y position
    this.sprite.body.velocity.x = this.xSpeed;
    this.sprite.body.velocity.y = this.ySpeed;
};

//update the bullets position
DirectedBullet.prototype.checkCollision = function(){
    //check for collision with platforms
    if(collideWithGround(this.sprite) == true){
        this.killBullet();//kill the bullet
    }

    //collision with player
    if(game.physics.arcade.collide(player, this.sprite) == true){
        //damage the player
        health -= 10;

        //kill the bullet
        this.killBullet();
    }

    //check for off screen
    if(this.sprite.position.x < 0 || this.sprite.position.u < 0 || this.sprite.position.x > game.world.width || this.sprite.position.y > game.world.height){
        this.killBullet(); //off screen, kill bullet
    }
};

//return true if the bullet is alive
DirectedBullet.prototype.isAlive = function(){
    //update the x and y position
    return this.alive;
};

//kills the bullet
DirectedBullet.prototype.killBullet = function(){
    //kill the bullet
    this.sprite.kill();
    //set alive to false
    this.alive = false;
};

//end of DirectedBullet class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////