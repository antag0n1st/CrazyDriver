(function(window,undefined){
    
    function TweenAlpha(from,to,bezier,duration,callback){
        this.initialize(from,to,bezier,duration,callback);
    }    
    //TweenAlpha.prototype = new ParentClassName();
    //TweenAlpha.prototype.parent_initialize = TweenAlpha.prototype.initialize;    
    TweenAlpha.prototype.initialize = function(object,to,bezier,duration,callback){        
    
        this.object = object;
        this.to = to;
        this.bezier = bezier;
        this.duration = duration;  
        this.callback = callback;        
        this.start_alpha = object.alpha;
        this.difference = to - this.start_alpha;
        this.time_passed = 0;
    };
    
    TweenAlpha.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenAlpha.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenAlpha.prototype.step = function(){
        
        this.time_passed += Ticker.step;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var step = this.bezier.get(s);
        
        this.object.alpha = this.start_alpha + step*this.difference;
        
        if(s===1){
            this.callback();
            Actions.remove(this);
        }
        
    };
    
    window.TweenAlpha = TweenAlpha;
    
}(window));