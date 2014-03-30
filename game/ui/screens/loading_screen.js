(function(window,undefined){
    
    function LoadingScreen(){
        this.initialize();
    }    
    
    LoadingScreen.prototype = new Screen();
    LoadingScreen.prototype.screen_initialize = LoadingScreen.prototype.initialize;    
    LoadingScreen.prototype.initialize = function(){        
        this.screen_initialize();
        
        this.label = new Label();
        this.label.set({
            text: "0%" ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_font_name : 'Sofadi One',
            text_size : 28
        });
        
        
        
        this.add_child(this.label);
        this.label.set_position(this.width/2 - this.label.width/2,this.height/2 - this.label.height/2);
        
    };
    
    LoadingScreen.prototype.show = function(){
        Screen.prototype.show.call(this);
        
    };
    
    LoadingScreen.prototype.hide = function(){
        Screen.prototype.hide.call(this);
        
    };
    
    LoadingScreen.prototype.update = function(){
        Screen.prototype.update.call(this);
         var to_load = ContentManager.count_resources;
         var loaded = ContentManager.loaded_resources;
         
         var loading = loaded/to_load;
         loading = loading ? loading : 100;
         
        //  if(ContentManager.loaded_resources == ContentManager.count_resources){
         
         this.label.set({text: "Loading: " + loading + " %" });
        
        
    };
    
    LoadingScreen.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    LoadingScreen.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    LoadingScreen.prototype.draw = function(context){
        
       
        
    };
    
    LoadingScreen.prototype.clear = function(context){
        
    };
    
    window.LoadingScreen = LoadingScreen;
    
}(window));