(function(window,undefined){
    
    function HomeScreen(){
        this.initialize();
    }    
    
    HomeScreen.prototype = new Screen();
    HomeScreen.prototype.screen_initialize = HomeScreen.prototype.initialize;    
    HomeScreen.prototype.initialize = function(){        
        this.screen_initialize();
        
        this.play_button = new Button({image:ContentManager.images.play_button});
        this.play_button.text = "Play Game";
        this.play_button.font_family = 'Sofadi One';
        this.play_button.text_color = "#000000";
        this.play_button.font_size = 30;
        this.play_button.on_mouse_up = HomeScreen.prototype.on_play.bind(this);
        
        this.sound_button = new Button({image:ContentManager.images.play_button});
        this.sound_button.text = "Sound: ON";
        this.sound_button.font_family = 'Sofadi One';
        this.sound_button.text_color = "#000000";
        this.sound_button.font_size = 30;
        this.sound_button.on_mouse_up = HomeScreen.prototype.on_sound.bind(this);
        
        this.background = new Sprite('market_background');
        this.background.z_index = -1;
        this.background.set_position(0,0);
        
        this.car = new Sprite('front_back');
        this.car.z_index = 0;
        this.car.set_position( -this.car.width , Config.screen_height - this.car.height);
        
        this.car_max_y = this.car.get_position().y - 1;
        this.car_min_y = this.car.get_position().y + 2;
        
        this.car_smoke = new Sprite('car_smoke');
        this.car_smoke.z_index = 1;
        this.car_smoke.set_position(-this.car_smoke.width, Config.screen_height - this.car_smoke.height);
        
        this.add_child(this.background);
        this.add_child(this.car);
        this.add_child(this.car_smoke);
        
        this.add_child(this.play_button);
        this.add_child(this.sound_button);
        
        this.play_button.set_position( 420,500);
        this.sound_button.set_position( 420,580);
        
        this.stop_animations = false;
        
       
       var that = this;
       
       var tween = new Tween(this.car,{x:0,y:this.car.get_position().y},new Bezier(.17,.67,.54,.99),350,function(){
                              //  this.object.remove_from_parent();
                              that.move_car();
       });
       tween.run();
       
       var tween2 = new Tween(this.car_smoke,{x:0,y:this.car_smoke.get_position().y},new Bezier(.17,.67,.54,.99),350,function(){
                 
           var bezier = new Bezier(.22,1.11,.75,1.42);
                          
                 var tw = new Tween(that.play_button,{x:420,y:200},bezier,350);
                 tw.run(); 
                 
                 var tw2 = new Tween(that.sound_button,{x:420,y:280},bezier,350);
                 tw2.run();  
                          
       });
       tween2.run();
       
        
    };
    
    HomeScreen.prototype.move_car = function(){
      
        if(!this.stop_animations){
                        
            var y = this.car.get_position().y;
            
            var that = this;
            
            if(this.car_min_y === y){                
                var tween = new Tween(this.car,{x:this.car.get_position().x,y:this.car_max_y},new Bezier(1,1,1,1),200,function(){
                              //  this.object.remove_from_parent();
                              that.move_car();
                });
                tween.run();
            }else{
                var tween = new Tween(this.car,{x:this.car.get_position().x,y:this.car_min_y},new Bezier(1,1,1,1),200,function(){
                              //  this.object.remove_from_parent();
                              that.move_car();
                });
                tween.run();
            }
            
            
        }
        
    };
    
    HomeScreen.prototype.on_play = function(){
        game.navigator.add(new GameScreen());
    };
    
    HomeScreen.prototype.on_sound = function(){
      
      Config.is_sound_on = !Config.is_sound_on;
      
      if(Config.is_sound_on){
          this.sound_button.text = "Sound: ON";
          Howler.unmute();
      }else{
          this.sound_button.text = "Sound: OFF";
          Howler.mute();
      }
      
    };
    
    HomeScreen.prototype.show = function(){
        Screen.prototype.show.call(this);
        game.input.add(this.play_button);
        game.input.add(this.sound_button);
        
    };
    
    HomeScreen.prototype.hide = function(){
        Screen.prototype.hide.call(this);
        game.input.remove(this.play_button);
        game.input.remove(this.sound_button);
        this.stop_animations = true;
        
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