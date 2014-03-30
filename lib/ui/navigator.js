//(function(window,undefined){
    
    function Navigator(){
        this.initialize();
    }
    
    Navigator.prototype.initialize = function(){
        
        this.screens = [];
        this.current_screen;
        this.new_screen;
        
    };
    
    // display the current screen whitout a queue in the navigator
    Navigator.prototype.just_display_screen = function(screen){
        
        if(this.current_screen){
            this.current_screen.hide(); // hide the last one
        }
        
        this.current_screen = screen;
        this.current_screen.show();
    };
    
    // add it to the stack of screens and show it
    Navigator.prototype.add = function(screen){
        
      
        if(this.current_screen){
            
            this.new_screen = screen;
            this.new_screen.show();
            
            var slide_old = new MoveTo(this.current_screen,{x:0,y:0},{x:-Config.screen_width,y:0},200);
            
            var slide_new = new MoveTo(this.new_screen,{x:Config.screen_width,y:0},{x:0,y:0},200,function(){
             
                game.navigator.current_screen.hide();
                game.navigator.current_screen = game.navigator.new_screen;
                game.navigator.screens.push(game.navigator.current_screen);
            });
            
            
            Actions.add(slide_old);
            Actions.add(slide_new);
                        
        }else{
            
            this.current_screen = screen;
            this.screens.push(screen);
            this.current_screen.show();
        }
    };
    
    Navigator.prototype.go_back = function() {

        if (this.screens.length) {
            
            
            if(this.screens.length > 1){
                
                this.new_screen = this.screens[this.screens.length - 2];
                
                var slide_old = new MoveTo(this.current_screen,{x:0,y:0},{x:Config.screen_width,y:0},200);
            
                var slide_new = new MoveTo(this.new_screen,{x:-Config.screen_width,y:0},{x:0,y:0},200,function(){
                    game.navigator.current_screen.hide();
                    game.navigator.current_screen = game.navigator.new_screen;
                    game.navigator.screens.pop();
                });


                Actions.add(slide_old);
                Actions.add(slide_new);

                this.new_screen.show();
                
            }else{
                console.log("can't go back , this is as far as it goes");
            }
        }

    };
    
    Navigator.prototype.go_to_root = function() {
        
        if (this.screens.length) {
            this.current_screen.hide(); // hide the last one
            
            this.current_screen = this.screens[0];
            this.current_screen.show();
        }
        
    };
    
    Navigator.prototype.remove_all = function(){
        
        for(var i=0;i<this.screens.length;i++){
            this.screens[i].hide();
        }        
        this.screens = [];
        this.current_screen = null;
    };
    
    Navigator.prototype.update = function(){
        
        this.current_screen.update();
    };
    
//    window.Navigator = Navigator;
//    
//}(window));