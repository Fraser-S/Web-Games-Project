/**
 * Created by B00251398 on 21/02/2017.
 */
var Preload = function(game){}
var music;
Preload.prototype = {

    preload: function(){


        this.game.load.image("start","Text/start.png");
        this.game.load.image("titleHeading","Text/titleHeading.png");
        this.game.load.image("storyHeading","Text/storyHeading.png");
        this.game.load.image("gameStart","Text/gameStart.png");
        this.game.load.image("controlsStart","Text/controls.png");
        this.game.load.audio('backgroundmusic', 'Audio/background.wav');
        this.game.load.image("menuStart","Text/menuStart.png");
        this.game.load.image("jump","Text/Jump.png");
        this.game.load.image("jumpButton","Text/W-Key.png");
        this.game.load.image("moveLeft","Text/Move-Left.png");
        this.game.load.image("leftButton","Text/A-Key.png");
        this.game.load.image("moveRight","Text/Move-Right.png");
        this.game.load.image("rightButton","Text/D-Key.png");
        this.game.load.image("shoot","Text/Shoot.png");
        this.game.load.image("shootButton","Text/Spacebar.png");
        this.game.load.image("reload","Text/Reload.png");
        this.game.load.image("reloadButton","Text/R-key.png");
        this.game.load.image("story1", "Text/story1.png");
        this.game.load.image("story2", "Text/story2.png");
        this.game.load.image("story3", "Text/story3.png");

        game.load.tilemap('level1', 'Assets/ATAlevel1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'Assets/ATAlevel2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('back', 'Assets/background1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'Assets/AlanSpriteSheet.png');
        game.load.image('backgrounds', 'Assets/backgrounds.png')



    },
    create: function(){
        var loadingTitle = this.game.add.sprite(game.world.centerX,game.world.centerY,"loading", this);
        loadingTitle.anchor.setTo(0.5);
        music = game.add.audio("backgroundmusic");
        if (!music.isPlaying){  music.play('',0,1,true);}
    },

    update: function(){
        if(!music.isDecoding){
            this.game.state.start("Title");
        }



    }


};