/**
 * Created by B00251398 on 21/02/2017.
 */
var Story = function(game) {};



Story.prototype = {
    create :create,
    playGame : playGame
};



function create(){



    game.stage.backgroundColor = "#385077";
    var storyTitle = this.game.add.sprite(game.world.centerX,game.world.centerY/4,"storyHeading", this);
    var story1 = this.game.add.sprite(game.world.centerX,game.world.centerY/2,"story1", this);
    var story2 = this.game.add.sprite(game.world.centerX,game.world.centerY/1.2,"story2", this);
    var story3 = this.game.add.sprite(game.world.centerX,game.world.centerY*1.1,"story3", this);
    var startGame = this.game.add.button(game.world.centerX,game.world.centerY *1.7,"start", this.playGame, this);

    storyTitle.anchor.setTo(0.5);
    story1.anchor.setTo(0.5);
    story2.anchor.setTo(0.5);
    story3.anchor.setTo(0.5);
    startGame.anchor.setTo(0.5);
}

function playGame(){
    this.game.state.start("Game");
}
