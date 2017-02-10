/**
 * Created by B00251398 on 31/01/2017.
 */
var Title = function(game) {};



Title.prototype = {
    create :create,
    playMenu : playMenu,
};



function create(){



    game.stage.backgroundColor = "#000000";
    var gameTitle = this.game.add.sprite(game.world.centerX,game.world.centerY/2.5,"titleHeading", this);
    var startMenu = this.game.add.button(game.world.centerX,game.world.centerY *1,"start", this.playMenu, this);

    gameTitle.anchor.setTo(0.5);
    startMenu.anchor.setTo(0.5);
}

function playMenu(){
    this.game.state.start("Menu");
}