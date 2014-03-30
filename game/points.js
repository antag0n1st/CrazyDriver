(function(window,undefined){
    
    function Points(){
        this.initialize();
    }    
    
    Points.prototype = new Drawable();
    Points.prototype.drawable_initialize = Points.prototype.initialize;    
    Points.prototype.initialize = function(){        
        this.drawable_initialize();
        this.image = ContentManager.images.points.image;
      
        this.set_size(this.image.width,this.image.height);
        this.set_anchor(0.5,0.5);
       
        
    };
    
    Points.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Points.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Points.prototype.draw = function(context){
                
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
    
    Points.prototype.clear = function(context){
        
    };
    
    window.Points = Points;
    
}(window));