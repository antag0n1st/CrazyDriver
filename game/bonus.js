(function(window,undefined){
    
    function Bonus(){
        this.initialize();
    }    
    
    Bonus.prototype = new Drawable();
    Bonus.prototype.drawable_initialize = Bonus.prototype.initialize;    
    Bonus.prototype.initialize = function(){        
        this.drawable_initialize();
        
        this.image = ContentManager.images.bonus.image;
        this.set_size(this.image.width,this.image.height);
        
        this.z_index = -1;
        
    };
    
    Bonus.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Bonus.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Bonus.prototype.draw = function(context){
        
        var pos = this.bounds.pos;
        context.drawImage(this.image,pos.x,pos.y);
        if(Config.debug){
            this.debug_bounds(context);
        }
        
        
    };
    
    Bonus.prototype.clear = function(context){
        
    };
    
    window.Bonus = Bonus;
    
}(window));