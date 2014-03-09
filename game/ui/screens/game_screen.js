(function(window, undefined) {

    function GameScreen() {
        this.initialize();
    }

    GameScreen.prototype = new Screen();
    GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;

    GameScreen.prototype.initialize = function() {
        this.screen_initialize();     
        
        this.player = new Player();
        
        this.player.set_position({x:100,y:200});
        
        this.add_child(this.player);
        
        this.kibo = new Kibo();
        
        this.is_down = false;
        this.is_up = false;
        this.is_left = false;
        this.is_right = false;
        
        this.player_speed = 1;
        
        var that = this;
        
        this.kibo.down(['up'], function() {
           that.is_up = true;
        });
        
        this.kibo.up(['up'], function() {
           that.is_up = false;
        });
        
        this.kibo.down(['down'], function() {
           that.is_down = true;
        });
        
        this.kibo.up(['down'], function() {
           that.is_down = false;
        });
        
         this.kibo.down(['left'], function() {
           that.is_left = true;
        });
        
        this.kibo.up(['left'], function() {
           that.is_left = false;
        });
        
        this.kibo.down(['right'], function() {
           that.is_right = true;
        });
        
        this.kibo.up(['right'], function() {
           that.is_right = false;
        });
        
        //cars
        this.cars = [];
        
        for(i=0;i<3;i++)
        {
            var car = new Car();
            
            car.start_position = {x:100,y:100};
            car.end_position = {x:100*i,y:100*i};
        
            car.set_position(car.start_position);
        
            this.add_child(car);
            
            this.cars.push(car);
        }
        
    };   

    GameScreen.prototype.game_over = function() {
        this.is_game_over = true;
    };

    GameScreen.prototype.update = function() {

        this.update_movement();
        
        for(var i in this.cars)
        {
            this.cars[i].move();
        }
     
    };
    
    GameScreen.prototype.update_movement = function() {
        
         if(this.is_right && this.is_down)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x+this.player_speed,y:p.y+this.player_speed});
            return;
        }
        
        if(this.is_right && this.is_up)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x+this.player_speed,y:p.y-this.player_speed});
            return;
        }
        
        if(this.is_left && this.is_down)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x-this.player_speed,y:p.y+this.player_speed});
            return;
        }
        
        if(this.is_left && this.is_up)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x-this.player_speed,y:p.y-this.player_speed});
            return;
        }

        if(this.is_down)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x,y:p.y+this.player_speed});
            return;
        }
        
        if(this.is_up)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x,y:p.y-this.player_speed});
            return;
        }
        
        if(this.is_left)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x-this.player_speed,y:p.y});
            return;
        }
        
        if(this.is_right)
        {
            var p = this.player.get_position();
            this.player.set_position({x:p.x+this.player_speed,y:p.y});
            return;
        }
        
    };

    GameScreen.prototype.show = function() {
        Screen.prototype.show.call(this);
    };

    GameScreen.prototype.hide = function() {
        Screen.prototype.hide.call(this);
    };

    window.GameScreen = GameScreen;

}(window));