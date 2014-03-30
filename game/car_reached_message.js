(function(window,undefined){
    
    function CarReachedMessage(){
        this.initialize();
    }    
    
    CarReachedMessage.prototype = new Drawable();
    CarReachedMessage.prototype.drawable_initialize = CarReachedMessage.prototype.initialize;    
    CarReachedMessage.prototype.initialize = function(){        
        this.drawable_initialize();
        this.image = ContentManager.images.return_the_cart.image;
      
        this.set_size(this.image.width,this.image.height);
        this.set_anchor(0.5,0.5);
       
        
    };
    
    CarReachedMessage.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    CarReachedMessage.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    CarReachedMessage.prototype.draw = function(context){
                
        var anchor = this.bounds.pos;
        var ach = this.get_anchor();
        var pos = this.bounds.pos.clone().add(new Vector(-this.width*ach.x,-this.height*ach.y));
        
        
        context.save();
        context.translate(anchor.x, anchor.y);     
        context.rotate(Math.degrees_to_radians(this.angle));
        context.translate(-anchor.x, -anchor.y);
        
        if(this.alpha !== 1){
            context.globalAlpha = this.alpha;
        }
        
        context.drawImage(this.image,pos.x,pos.y);
        context.restore();
        if(Config.debug){
            this.debug_bounds(context);
        }
        
    };
    
    CarReachedMessage.prototype.clear = function(context){
        
    };
    
    window.CarReachedMessage = CarReachedMessage;
    
}(window));