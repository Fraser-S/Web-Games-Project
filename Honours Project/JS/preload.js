/**
 * Created by B00251398 on 31/01/2017.
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
        this.game.load.image("scoreHeading","Text/scoreHeading.png");
        this.game.load.image("virus","Assets/virus.png");
        this.game.load.image("menuStart","Text/menuStart.png");
        this.game.load.image("jump","Text/Jump.png");
        this.game.load.image("jumpButton","Text/Up-Cursor.png");
        this.game.load.image("moveLeft","Text/Move-Left.png");
        this.game.load.image("leftButton","Text/Left-Cursor-.png");
        this.game.load.image("moveRight","Text/Move-Right.png");
        this.game.load.image("rightButton","Text/Right-Cursor-.png");
        this.game.load.image("aim","Text/Aim.png");
        this.game.load.image("aimButton","Text/Mouse.png");
        this.game.load.image("shoot","Text/Shoot.png");
        this.game.load.image("shootButton","Text/Left-Click.png");
        this.game.load.image("reload","Text/Reload.png");
        this.game.load.image("reloadButton","Text/Scroll-Wheel.png");
        this.game.load.image("story1","Text/story1.png");
        this.game.load.image("story2","Text/story2.png");
        this.game.load.image("story3","Text/story3.png");


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