/**
 * Created by B00251398 on 31/01/2017.
 */
var Menu = function(game) {};



Menu.prototype = {
    create : create,
    startGame : startGame,
    startControls : startControls
};

var score = 0;
var gameButton;
var controlsButton;






function create() {
    var menuTitle = this.game.add.sprite(game.world.centerX, game.world.centerY / 3, "titleHeading", this);
    var scoreText = game.add.text(50, 3, '' + score, {fontSize: '15px', fill: '#FF0000'});
    scoreHeading = game.add.sprite(0, 0, "scoreHeading");
    scoreText.text = '' + score;

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

