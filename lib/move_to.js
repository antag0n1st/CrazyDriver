//(function(window,undefined){
    
    function MoveTo(object,from,to,duration,callback){
        this.initialize(object,from,to,duration,callback);
    }
    
    MoveTo.prototype.initialize = function(object,from,to,duration,callback){
        this.time_passed = 0;
        this.object = object;
        this.from = from;
        this.to = to;
        this.duration = duration;
        this.callback = callback;
        object.set_position(from.x,from.y);
        this.speed_x = (to.x - from.x)/this.duration;
        this.speed_y = (to.y - from.y)/this.duration;
        
    };
    
    MoveTo.prototype.step = function(step){
        
         this.time_passed += step;
         
         if(this.time_passed >= this.duration){
             
             this.object.set_position(this.to.x,this.to.y);
             
             // ready for callback
             if(this.callback){
                 this.callback(); //TODO call the callback in the context of the object
             }
             
             Actions.remove(this); // remove this action
             
         }else{
             var iteration_x = step * this.speed_x;
             var iteration_y = step * this.speed_y;
            
             var pos = this.object.get_position();
             this.object.set_position(pos.x+iteration_x,pos.y+iteration_y);
         }
         
        
    };
    
//    window.MoveTo = MoveTo;
    
//}(window));