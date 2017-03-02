/**
 * Created by B00251398 on 21/02/2017.
 */
var Boot = function(game){
    console.log("The Game is Loading up");
};

Boot.prototype = {
    preload: function(){
        this.game.load.image("loading","Text/loading.png");
    },
    create: function(){

        this.scale.pageAlignHorizontally = true
        this.game.state.start("Preload");
    }
}