/**
 * Created by B00251398 on 31/01/2017.
 */
var Controls = function (game){};

Controls.prototype = {
    create: create,
    startMenu: startMenu
};





function create()
{
    var controlsTitle = this.game.add.sprite(game.world.centerX, game.world.centerY / 10, "controlsStart", this);
    var menuButton = this.game.add.button(game.world.centerX, game.world.centerY * 1.8, "menuStart", this.startMenu, this);
    controlsTitle.anchor.setTo(0.5);
    menuButton.anchor.setTo(0.5);




    var jumpTitle = this.game.add.sprite(game.world.centerX / 8, game.world.centerY / 4, "jump", this);
    var jumpButton = this.game.add.sprite(game.world.centerX * 1, game.world.centerY / 4, "jumpButton", this);
    var leftTitle = this.game.add.sprite(game.world.centerX / 8, game.world.centerY / 2, "moveLeft", this);
    var leftButton = this.game.add.sprite(game.world.centerX * 1, game.world.centerY / 2, "leftButton", this);
    var rightTitle = this.game.add.sprite(game.world.centerX / 8, game.world.centerY / 1.5, "moveRight", this);
    var rightButton = this.game.add.sprite(game.world.centerX * 1, game.world.centerY / 1.5, "rightButton", this);
    var reloadTitle = this.game.add.sprite(game.world.centerX /8, game.world.centerY, "reload", this);
    var reloadButton = this.game.add.sprite(game.world.centerX * 1, game.world.centerY, "reloadButton", this);
    var aimTitle = this.game.add.sprite(game.world.centerX / 8, game.world.centerY * 1.3, "aim", this);
    var aimButton = this.game.add.sprite(game.world.centerX * 1, game.world.centerY * 1.3, "aimButton", this);
    var shootTitle = this.game.add.sprite(game.world.centerX / 8, game.world.centerY * 1.5, "shoot", this);
    var shootButton = this.game.add.sprite(game.world.centerX * 1, game.world.centerY * 1.5, "shootButton", this);
}

function startMenu()
{

    this.game.state.start("Menu");

}