(function(window,undefined){
    
    function WinCar(){
        this.initialize();
    }    
    
    WinCar.prototype = new Drawable();
    WinCar.prototype.drawable_initialize = WinCar.prototype.initialize;    
    WinCar.prototype.initialize = function(){        
        this.drawable_initialize();
        
        this.image = ContentManager.images.car.image;
        this.set_size(this.image.width,this.image.height);
        
    };
    
    WinCar.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    WinCar.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    WinCar.prototype.draw = function(context){
        
        var pos = this.bounds.pos;
        context.drawImage(this.image,pos.x,pos.y);
        if(Config.debug){
            this.debug_bounds(context);
        }
        
        
    };
    
    WinCar.prototype.clear = function(context){
        
    };
    
    window.WinCar = WinCar;
    
}(window));