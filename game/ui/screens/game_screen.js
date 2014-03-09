(function(window, undefined) {

    function GameScreen() {
        this.initialize();
    }

    GameScreen.prototype = new Screen();
    GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;

    GameScreen.prototype.initialize = function() {
        this.screen_initialize();     
        
        this.player = new Player();
        
        this.player.set_position({x:100,y:200});
        
        this.add_child(this.player);
        
        this.kibo = new Kibo();
        
        this.is_down = false;
        this.is_up = false;
        this.is_left = false;
        this.is_right = false;
        
        
        this.kibo.down(['up'], function() {
           this.is_up = true;
        });
        
        this.kibo.up(['up'], function() {
           this.is_up = false;
        });
        
    };   

    GameScreen.prototype.game_over = function() {
        this.is_game_over = true;
    };

    GameScreen.prototype.update = function() {

    
     

    };

    GameScreen.prototype.show = function() {
        Screen.prototype.show.call(this);
    };

    GameScreen.prototype.hide = function() {
        Screen.prototype.hide.call(this);
    };

    window.GameScreen = GameScreen;

}(window));