(function(window,undefined){
    
    function TestScreen(){
        this.initialize();
    }    
    
    TestScreen.prototype = new Screen();
    TestScreen.prototype.screen_initialize = TestScreen.prototype.initialize;    
    TestScreen.prototype.initialize = function(){        
        this.screen_initialize();
        
    };
    
    TestScreen.prototype.show = function(){
        Screen.prototype.show.call(this);
        
    };
    
    TestScreen.prototype.hide = function(){
        Screen.prototype.hide.call(this);
        
    };
    
    TestScreen.prototype.update = function(){
        Screen.prototype.update.call(this);
        
    };
    
    TestScreen.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    TestScreen.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    TestScreen.prototype.draw = function(context){
        
    };
    
    TestScreen.prototype.clear = function(context){
        
    };
    
    window.TestScreen = TestScreen;
    
}(window));