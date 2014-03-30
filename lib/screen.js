//(function(window, undefined) {

    function Screen() {
        this.initialize();
    }
    
    Screen.prototype = new Drawable();
    Screen.prototype.drawable_initialize = Screen.prototype.initialize;

    Screen.prototype.initialize = function() {
        this.drawable_initialize();
        
        this.set_size(Config.screen_width,Config.screen_height );
        
    };


    Screen.prototype.show = function() {
        
        game.stage.add(this);

    };

    Screen.prototype.hide = function() {

        this.remove_from_parent();

    };
    
    Screen.prototype.draw = function(context){};
    Screen.prototype.clear = function(context){};

    Screen.prototype.update = function() {};

    window.Screen = Screen;

//}(window));