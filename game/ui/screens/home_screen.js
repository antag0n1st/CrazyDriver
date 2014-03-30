(function(window,undefined){
    
    function HomeScreen(){
        this.initialize();
    }    
    
    HomeScreen.prototype = new Screen();
    HomeScreen.prototype.screen_initialize = HomeScreen.prototype.initialize;    
    HomeScreen.prototype.initialize = function(){        
        this.screen_initialize();
        
        this.play_button = new Button({image:ContentManager.images.button});
        this.play_button.text = "Play Game";
        this.play_button.font_family = 'Sofadi One';
        this.play_button.text_color = "#ffffff";
        this.play_button.font_size = 18;
        this.play_button.on_mouse_up = HomeScreen.prototype.on_play.bind(this);
        
        this.add_child(this.play_button);
        
        this.play_button.set_position( this.width/2 - this.play_button.width/2,this.height/2 - this.play_button.height/2 );
        
    };
    
    HomeScreen.prototype.on_play = function(){
        game.navigator.add(new GameScreen());
    };
    
    HomeScreen.prototype.show = function(){
        Screen.prototype.show.call(this);
        game.input.add(this.play_button);
        
    };
    
    HomeScreen.prototype.hide = function(){
        Screen.prototype.hide.call(this);
        game.input.remove(this.play_button);
        
    };
    
    HomeScreen.prototype.update = function(){
        Screen.prototype.update.call(this);
        
    };
    
    HomeScreen.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    HomeScreen.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    HomeScreen.prototype.draw = function(context){
        
    };
    
    HomeScreen.prototype.clear = function(context){
        context.clearRect(0,0,Config.screen_width,Config.screen_height);
    };
    
    window.HomeScreen = HomeScreen;
    
}(window));