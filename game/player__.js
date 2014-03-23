(function(window,undefined){
    
    function Player(){
        this.initialize();
    }    
    
    Player.prototype = new Animation();
    Player.prototype.animation_initialize = Player.prototype.initialize;    
    Player.prototype.initialize = function(){        
        
        var sprite_sheet = new SpriteSheet([{
                image: ContentManager.images.player,
                frames: {x: 8, y: 1},
                animations: {
                    run: {start: 0, end: 7, loop: true, duration: 800},
                    idle: {start: 2, end: 2, loop: true, duration: 100}
                }
                , reg: {x: 0.5, y: 0.5, width: 1.0, height: 1.0}
            }]);

        this.animation_initialize(sprite_sheet);
        
        
    };
    
    Player.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Player.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Player.prototype.draw = function(context){
        Animation.prototype.draw.call(this,context);
    };
    
    Player.prototype.clear = function(context){
        
    };
    
    window.Player = Player;
    
}(window));