(function(window,undefined){
    
    function TweenScale(object,to,bezier,duration,callback){
        this.initialize(object,to,bezier,duration,callback);
    }    
    //TweenScale.prototype = new ParentClassName();
    //TweenScale.prototype.parent_initialize = TweenScale.prototype.initialize;    
    TweenScale.prototype.initialize = function(object,to,bezier,duration,callback){        
    
        this.object = object;
        this.to = to;
        this.bezier = bezier;
        this.duration = duration;  
        this.callback = callback || function(){};       
        this.start_scale = object.scale_x;
        this.difference = to - this.start_scale;
        this.time_passed = 0;
    };
    
    TweenScale.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenScale.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenScale.prototype.step = function(){
        
        this.time_passed += Ticker.step;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var step = this.bezier.get(s);
        
         this.object.set_scale(this.start_scale + step*this.difference);
        
        if(s===1){
            this.callback();
            Actions.remove(this);
        }
        
    };
    
    window.TweenScale = TweenScale;
    
}(window));