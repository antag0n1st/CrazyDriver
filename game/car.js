(function(window,undefined){
    
    function Car(){
        this.initialize();
    }    
    
    Car.prototype = new Drawable();
    Car.prototype.drawable_initialize = Car.prototype.initialize;    
    Car.prototype.initialize = function(){        
        this.drawable_initialize();
        
        this.image = ContentManager.images.car.image;
        
        this.start_position={x:0,y:0};
        this.end_position={x:0,y:0};
        this.speed = 100/1000;
        
        
    };
    
    Car.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Car.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Car.prototype.draw = function(context){
        
        var p = this.bounds.position;
        
        context.drawImage(this.image,p.x,p.y);
        
    };
    
    Car.prototype.clear = function(context){
        
    };
    
    Car.prototype.move = function(){
      var p = this.get_position();
      var angle = Math.get_angle(this.start_position, this.end_position);
      var distance = this.speed*Ticker.step;
      var next = Math.get_next_point(p, distance, angle);
      
      var total_distance = Math.get_distance(this.start_position, this.end_position);
      var current_distance = Math.get_distance(this.start_position, next);
      
      if(current_distance<=total_distance)
      {
        this.set_position(next);
      }
      else
      {
          
      }
    };
    
    window.Car = Car;
    
}(window));