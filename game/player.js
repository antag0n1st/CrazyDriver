(function(window,undefined){
    
    function Player(){
        this.initialize();
    }    
    
    Player.prototype = new Drawable();
    Player.prototype.drawable_initialize = Player.prototype.initialize;    
    Player.prototype.initialize = function(){        
        this.drawable_initialize();
        
        this.image = ContentManager.images.player.image;
        
    };
    
    Player.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Player.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Player.prototype.draw = function(context){
        
        var p = this.bounds.position;
        
        context.drawImage(this.image,p.x,p.y);
        
    };
    
    Player.prototype.clear = function(context){
        
    };
    
    window.Player = Player;
    
}(window));