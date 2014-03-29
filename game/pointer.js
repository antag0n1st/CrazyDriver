(function(window,undefined){
    
    function Pointer(){
        this.initialize();
    }    
    
    Pointer.prototype = new Drawable();
    Pointer.prototype.drawable_initialize = Pointer.prototype.initialize;    
    Pointer.prototype.initialize = function(){        
        this.drawable_initialize();
        this.image = ContentManager.images.pointer.image;
      
        this.set_size(this.image.width,this.image.height);
        this.set_anchor(0.5,0.5);
        this.duration = 200;
        this.time_passed = 0;
        
        this.offset = 10;
        
    };
    
    Pointer.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Pointer.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Pointer.prototype.draw = function(context){
                
        var anchor = this.bounds.pos;
        var ach = this.get_anchor();
        var pos = this.bounds.pos.clone().add(new Vector(-this.width*ach.x,-this.height*ach.y));
        
        this.time_passed += Ticker.step;
        
        var t = Math.sin(this.time_passed/this.duration);
        
        context.save();
        context.translate(anchor.x, anchor.y);
        context.rotate(Math.degrees_to_radians(this.angle));
        context.translate(-anchor.x, -anchor.y);
        
        context.drawImage(this.image,pos.x + this.offset*t,pos.y);
        context.restore();
        
        this.debug_bounds(context);
    };
    
    Pointer.prototype.clear = function(context){
        
    };
    
    window.Pointer = Pointer;
    
}(window));