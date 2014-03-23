(function(window, undefined) {

    function GameScreen() {
        this.initialize();
    }

    GameScreen.prototype = new Screen();
    GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;

    GameScreen.prototype.initialize = function() {
        this.screen_initialize();

        this.back_image = ContentManager.images.parking.image;

        this.player = new Player();

        
        this.player.set_position(580,400);
        this.player.rotate_to(270);
        
        this.win_car = new WinCar();
        this.win_car.set_position(100,60);

        this.car_size;

        this.add_child(this.player);
        this.add_child(this.win_car);

        this.kibo = new Kibo();

        this.is_down = false;
        this.is_up = false;
        this.is_left = false;
        this.is_right = false;
        
        this.is_game_over = false;

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

        for (i = 0; i < 7; i++)
        {
            var that = this;
            setTimeout(function() {

                var car = new Car();
                car.callback = GameScreen.prototype.car_callback.bind(that);

                that.car_size = Math.sqrt(Math.pow(car.car_size, 2) + Math.pow(car.car_size, 2));
               

                var points = that.generate_random_points();

                car.reset_position(points);

                that.add_child(car);

                that.cars.push(car);

            }, i * 700);

        }
        

    };
    
    GameScreen.prototype.on_mouse_up = function(event){
       log(SAT.pointInPolygon(event.point,this.player.collider));
    };

    GameScreen.prototype.generate_random_points = function()
    {
        
        var points = [];
        var start_side = Math.random_int(0, 3);
        
        var end_side = Math.random_int(0, 3);
        while (start_side == end_side)
        {
            end_side = Math.random_int(0, 3);
        }

        if (start_side == 0 || end_side == 0)
        {
            points.push({x: Config.screen_width + this.car_size,
                y: Math.random_int(-this.car_size, Config.screen_height + this.car_size)});
        }

        if (start_side == 1 || end_side == 1)
        {
            points.push({x: Math.random_int(-this.car_size, Config.screen_width + this.car_size),
                y: Config.screen_height + this.car_size});
        }

        if (start_side == 2 || end_side == 2)
        {
            points.push({x: -this.car_size,
                y: Math.random_int(-this.car_size, Config.screen_height + this.car_size)});
        }

        if (start_side == 3 || end_side == 3)
        {
            points.push({x: Math.random_int(-this.car_size, Config.screen_width + this.car_size),
                y: -this.car_size});
        }

        return points;
    };

    GameScreen.prototype.car_callback = function(car)
    {
        var points = this.generate_random_points();

        car.reset_position(points);
    };

    GameScreen.prototype.game_over = function() {
        this.is_game_over = true;
    };

    GameScreen.prototype.update = function() {

        if (!this.is_game_over)
        {
            //movement for the player
            this.update_movement();
            

            for (var i in this.cars)
            {
                var car = this.cars[i];
                
                car.move();
                
                car.smoke(); // leave a trail of smoke
                
                if (SAT.testPolygonPolygon(this.player.bounds, car.bounds))
                {
                    this.game_over();
                }
            }
        }


    };

    GameScreen.prototype.draw = function(context) {

        context.drawImage(this.back_image, 0, 0);
        

    };

    GameScreen.prototype.update_movement = function() {

        this.player.play("run");

        if (this.is_right && this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(135);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            //this.player.set_position(p.x + this.player_speed,p.y + this.player_speed);
            return;
        }

        if (this.is_right && this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(45);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            return;
        }

        if (this.is_left && this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(225);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            return;
        }

        if (this.is_left && this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(-45);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            return;
        }

        if (this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(180);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            return;
        }

        if (this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(0);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            return;
        }

        if (this.is_left)
        {
           var p = this.player.get_position();
            this.player.rotate_to(-90);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            return;
        }

        if (this.is_right)
        {
            var p = this.player.get_position();
            this.player.rotate_to(90);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x,p.y);
            return;
        }

        this.player.play("idle");
    };

    GameScreen.prototype.checkCollisions = function()
    {

    }

    GameScreen.prototype.show = function() {
        Screen.prototype.show.call(this);
        game.input.add(this);
    };

    GameScreen.prototype.hide = function() {
        Screen.prototype.hide.call(this);
        game.input.remove(this);
    };

    window.GameScreen = GameScreen;

}(window));