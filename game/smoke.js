(function(window,undefined){
    
    function Smoke(direction){
        this.initialize(direction);
    }    
    
    Smoke.prototype = new Drawable();
    Smoke.prototype.drawable_initialize = Smoke.prototype.initialize;    
    Smoke.prototype.initialize = function(direction){        
        this.drawable_initialize();
        
        this.duration = 400;
        this.direction = direction;
        this.total_time=0;
        
        this.begin_scale = 0.1;
        this.end_scale = 0.7;
        
        this.begin_alpha = 0.8;
        this.end_alpha = 0.0;
        
        
        
        this.image = ContentManager.images.smoke.image;
        
        this.width = this.image.width;
        this.height = this.image.height;
        
    };
    
    Smoke.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Smoke.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Smoke.prototype.draw = function(context){
      
        
        
        var position = this.bounds.get_position();
        
        this.total_time += Ticker.step;
        
        var t = this.total_time / this.duration;
        
       
        
        if(t > 1.0){
            this.remove_from_parent();
        }else{
           
            context.save();
            
            var f =  this.begin_scale + (this.end_scale - this.begin_scale)*t;
    
            var a =  this.begin_alpha + (this.end_alpha - this.begin_alpha)*t;
            
            context.globalAlpha = a;
      
            context.drawImage(this.image,0,0,this.width,this.height,
            position.x- f*this.width/2,position.y - f*this.height/2,
            this.width*f ,this.height*f);
        
        
             context.restore();
        }
               
        
        
    };
    
    Smoke.prototype.clear = function(context){
        
    };
    
    window.Smoke = Smoke;
    
}(window));