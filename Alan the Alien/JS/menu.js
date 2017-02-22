/**
 * Created by B00251398 on 21/02/2017.
 */
var Menu = function(game) {};



Menu.prototype = {
    create : create,
    startGame : startGame,
    startControls : startControls
};

var gameButton;
var controlsButton;






function create() {
    var menuTitle = this.game.add.sprite(game.world.centerX, game.world.centerY / 3, "titleHeading", this);
    gameButton = this.game.add.button(game.world.centerX, game.world.centerY/1.5, "gameStart", this.startGame, this);
    controlsButton = this.game.add.button(game.world.centerX, game.world.centerY * 1.5, "controlsStart", this.startControls, this);

    menuTitle.anchor.setTo(0.5);
    gameButton.anchor.setTo(0.5);
    controlsButton.anchor.setTo(0.5);
}



function startGame() {
    this.game.state.start("Story");
}

function startControls() {
    this.game.state.start("Controls");
}

