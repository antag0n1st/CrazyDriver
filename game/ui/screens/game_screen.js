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


        this.player.set_position(580, 460);
        this.player.rotate_to(0);

        this.win_car_poss = [{x: 46, y: 50}, {x: 100, y: 50}, {x: 152, y: 50}, {x: 204, y: 50}, {x: 46, y: 180}, {x: 46, y: 250} ];
        
        this.win_car_pos = Math.random_int(0, 5);
        this.win_car_start_angle = Math.random_int(0, 1);

        this.win_car = new WinCar();
        this.win_car.set_position(100,60);
        
        this.market = new Box(new Vector(500,425),165,55).toPolygon();
        
        this.alert = new Alert(1);
        this.alert.set_position(Config.screen_width/2 - this.alert.width/2,Config.screen_height/2 - this.alert.height/2);

        this.car_size;

        this.add_child(this.player);
        this.add_child(this.win_car);
        

        this.kibo = new Kibo();

        this.is_down = false;
        this.is_up = false;
        this.is_left = false;
        this.is_right = false;

        this.is_game_over = false;
        this.is_win_car_reach = false;

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

        for (i = 0; i < 14; i++)
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

    GameScreen.prototype.on_mouse_up = function(event) {
        log(event.point);
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
        this.add_child(this.alert);
    };

    GameScreen.prototype.update = function() {

        if (!this.is_game_over)
        {
            //movement for the player
            this.update_movement();

            var response = new SAT.Response();

            if (SAT.testPolygonPolygon(this.player.bounds, this.win_car.bounds, response))
            {
                this.is_win_car_reach = true;

                var resolve_pos = response.a.pos.clone();
                resolve_pos.sub(response.overlapV);
                this.player.set_position(resolve_pos.x, resolve_pos.y);
                
                response.clear();
            }

            if (SAT.testPolygonPolygon(this.player.bounds, this.market))
            {
                if (this.is_win_car_reach)
                {
                    log("yeeee");
                    this.game_over();
                }
            }

            for (var i in this.cars)
            {
                var car = this.cars[i];

                car.move();

                car.smoke(); // leave a trail of smoke

                if (SAT.testPolygonPolygon(this.player.bounds, car.bounds))
                {
                    this.game_over();
                }

                if (SAT.testPolygonPolygon(car.bounds, this.win_car.bounds, response))
                {
                    var resolve_pos = response.a.pos.clone();
                    resolve_pos.sub(response.overlapV);
                    car.set_position(resolve_pos.x, resolve_pos.y);
                    var angle = Math.random_int(-20, 20);
                    car.velocity.setAngle(Math.degrees_to_radians(car.angle + angle + 180 - 90));
                    car.rotate_to(car.angle + angle + 180);

                    response.clear();
                }

                if (SAT.testPolygonPolygon(car.bounds, this.market, response))
                {
                    var resolve_pos = response.a.pos.clone();
                    resolve_pos.sub(response.overlapV);
                    car.set_position(resolve_pos.x, resolve_pos.y);
                    var angle = Math.random_int(-20, 20);
                    car.velocity.setAngle(Math.degrees_to_radians(car.angle + angle + 180 - 90));
                    car.rotate_to(car.angle + angle + 180);

                    response.clear();
                }

                for (var j in this.cars)
                {
                    var another_car = this.cars[j];

                    if (car != another_car && SAT.testPolygonPolygon(another_car.bounds, car.bounds, response))
                    {
                        var resolve_pos = response.a.pos.clone();
                        resolve_pos.sub(response.overlapV);
                        another_car.set_position(resolve_pos.x, resolve_pos.y);
                        var angle = Math.random_int(0, 30);
                        another_car.velocity.setAngle(Math.degrees_to_radians(another_car.angle - 15 + angle - 90));
                        another_car.rotate_to(another_car.angle - 15 + angle);

                        response.clear();
                    }
                }
            }
        }
    };

    GameScreen.prototype.draw = function(context) {

        context.drawImage(this.back_image, 0, 0);
        Drawable.draw_polygon(this.market, context);

    };

    GameScreen.prototype.update_movement = function() {

        this.player.play("run");

        if (this.is_right && this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(135);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
            //this.player.set_position(p.x + this.player_speed,p.y + this.player_speed);
            return;
        }

        if (this.is_right && this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(45);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_left && this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(225);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_left && this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(-45);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(180);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(0);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_left)
        {
            var p = this.player.get_position();
            this.player.rotate_to(-90);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_right)
        {
            var p = this.player.get_position();
            this.player.rotate_to(90);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            this.player.set_position(p.x, p.y);
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
