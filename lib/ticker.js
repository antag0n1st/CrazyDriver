(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Ticker.time = new Date().getTime();
            var timeToCall = Math.max(0, 33 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//(function(window,undefined){
    
    function Ticker(){
        throw 'can not initialize';
    }
    
    Ticker.is_started = false;
    Ticker.timeout_id = null;
    Ticker.listeners = [];
    Ticker.interval = 0;
    Ticker.fps = 30;
    Ticker.calculated_fps=1;
    Ticker.ticks = 0;
    Ticker.started_at = 0;
    Ticker.delta = 1;
    Ticker.time = 0;
    Ticker.step = 33; // initial value
    
    Ticker.add_listener = function(o){
        Ticker.listeners.push(o);
    };
    
    Ticker.remove_listener = function(o){
        var index = Ticker.listeners.indexOf(o);
        if(index !== -1){
            Ticker.listeners.splice(index,1);
        }        
    };
    
    Ticker.remove_all_listeners = function(){
        Ticker.listeners = [];
    };
    
    Ticker.start = function(){
        if(!Ticker.is_started){
          
            if(!Config.is_mobile){
                Ticker.started_at = new Date().getTime();
            }
            Ticker.is_started = true;
           
            cancelAnimationFrame(Ticker.timeout_id);
           
            Ticker.tick(Ticker.started_at);
            
        }
    };
    
    Ticker.stop = function(){
            Ticker.is_started = false;
            cancelAnimationFrame(Ticker.timeout_id);
    };
    
    Ticker.set_fps = function(fps){
        Ticker.fps = fps;
        Ticker.interval = 1000/fps | 0;
    };
    
    Ticker.recalculate_movement = function(x){
           return (x * Ticker.step) * (Ticker.fps / 1000);
    };
    
    Ticker.tick = function(timestamp){
        
      
        if(!Config.is_mobile){
           timestamp = new Date().getTime();
           Ticker.timeout_id = requestAnimationFrame(Ticker.tick);
        }
    
        if(Ticker.is_started){
           
            
                var step = Ticker.step;
                step = timestamp - Ticker.time;
               // console.log();
                Ticker.step = (step > Ticker.interval) ? Ticker.interval : step; // limit the step
                Ticker.time = timestamp;
                
                Ticker.ticks++;
                if(timestamp - Ticker.started_at > 1000){
                    
                    Ticker.calculated_fps = Ticker.ticks;
                    Ticker.started_at = timestamp;
                   
                    //console.log(Ticker.ticks);
                    Ticker.ticks = 0;
                }
                var l = Ticker.listeners.length;
		for (var i=l;i--;) {
			Ticker.listeners[i].tick();
                }     
               
        }
        
    };
    
//    window.Ticker = Ticker;
//    
//}(window));