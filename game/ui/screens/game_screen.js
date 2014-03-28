(function(window, undefined) {

    function GameScreen() {
        this.initialize();
    }

    GameScreen.prototype = new Screen();
    GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;

    GameScreen.prototype.initialize = function() {
        this.screen_initialize();

        this.back_image = ContentManager.images.parking.image;

        this.level = 1;
        this.level_points = 100;
        this.points = 0;
        this.start_cars = 5;
        this.level_difficulty = 1;

        this.cars = [];

        this.hud = new Hud();
        this.hud.z_index = 5;
        this.hud.set_position(0, 0);
        this.hud.level = this.level;
        this.hud.level_points = this.level_points;
        this.hud.points = this.points;

        this.time_passed = 0;
        this.current_second = 0;

        this.player = new Player();

        this.win_car_poss = [{x: 46, y: 50}, {x: 100, y: 50}, {x: 152, y: 50}, {x: 204, y: 50}, {x: 46, y: 180}, {x: 46, y: 250}];

        this.win_car_pos = Math.random_int(0, 5);
        this.win_car_start_angle = Math.random_int(0, 1);

        this.win_car = new WinCar();
        this.bonus = new Bonus();


        this.market = new Box(new Vector(496, 422), 174, 75).toPolygon();

        win_alert = this.win_alert = new GameWinAlert(1);
        this.win_alert.set_position(Config.screen_width / 2 - this.win_alert.width / 2, Config.screen_height / 2 - this.win_alert.height / 2);
        this.win_alert.callback = GameScreen.prototype.on_next_level.bind(this);

        this.over_alert = new GameOverAlert(1);
        this.over_alert.set_position(Config.screen_width / 2 - this.over_alert.width / 2, Config.screen_height / 2 - this.over_alert.height / 2);
        this.over_alert.callback = GameScreen.prototype.on_restart_game.bind(this);

        this.car_size;

        this.add_child(this.player);
        this.add_child(this.win_car);
        this.add_child(this.hud);
        this.add_child(this.bonus);

        this.kibo = new Kibo();

        this.is_down = false;
        this.is_up = false;
        this.is_left = false;
        this.is_right = false;

        this.is_game_over = false;
        this.state = 0;

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

        this.reset_game_objects();


    };

    GameScreen.prototype.reset_game_objects = function() {

        var num = this.start_cars + this.level;
        var that = this;

        var pps = this.win_car_poss[this.win_car_pos];
        this.win_car.set_position(pps.x, pps.y);

        this.bonus.set_position(Math.random_int(30, Config.screen_width - 30), Math.random_int(30, Config.screen_height - 30));

        this.player.set_position(580, 460);
        this.player.rotate_to(0);

        for (var i = 0; i < this.cars.length; i++) {
            this.cars[i].remove_from_parent();
        }

        this.cars = [];

        for (var i = 0; i < num; i++)
        {

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
        this.over_alert.points = this.points;
        this.over_alert.level = this.level;
        log(this.over_alert.points);
        log(this.over_alert.level);
        
        this.points = 0;
        this.hud.points = this.points;
        this.level = 1;
        this.hud.level = 1;
        this.level_points = 100;
        this.hud.level_points = this.level_points;
        this.state = 0;
        
        this.is_game_over = true;
        this.player.play('idle');
        
        this.add_child(this.over_alert);
    };

    GameScreen.prototype.game_win = function() {
        this.points = this.points + this.level_points;
        this.hud.points = this.points;
        this.level_points = 100;
        this.state = 0;
        this.is_game_over = true;
        this.player.play('idle');
        this.win_alert.level = this.level;
        this.win_alert.points = this.points;
        this.add_child(this.win_alert);
    };

    GameScreen.prototype.on_restart_game = function() {
        
        this.reset_game_objects();
        this.is_game_over = false;

    };

    GameScreen.prototype.on_next_level = function() {
        this.level++;
        this.on_restart_game();
        this.hud.level = this.level;
        this.hud.update();
    };

    GameScreen.prototype.update = function() {


        if (!this.is_game_over)
        {
            //movement for the player
            this.update_movement();

            this.time_passed += Ticker.step;

            if (this.time_passed >= 1000)
            {
                this.level_points--;
                this.time_passed -= 1000;

                this.hud.level_points = this.level_points;
                this.hud.level = this.level;
            }

            var response = new SAT.Response();

            //player win_car collision
            if (SAT.testPolygonPolygon(this.player.bounds, this.win_car.bounds, response))
            {
                if (this.state == 0)
                    this.state = 1;

                if (this.state == 2)
                    this.game_win();

                var resolve_pos = response.a.pos.clone();
                resolve_pos.sub(response.overlapV);
                this.player.set_position(resolve_pos.x, resolve_pos.y);

                response.clear();
            }

            //player market collision
            if (SAT.testPolygonPolygon(this.player.bounds, this.market))
            {
                if (this.state == 1)
                    this.state = 2;
            }

            //player bonus collision
            if (SAT.testPolygonPolygon(this.player.bounds, this.bonus.bounds))
            {
                this.bonus.set_position(Math.random_int(30, Config.screen_width - 30), Math.random_int(30, Config.screen_height - 30));
                this.level_points += 5;
            }

            //win_car bonus collision
            while (SAT.testPolygonPolygon(this.win_car.bounds, this.bonus.bounds))
            {
                this.bonus.set_position(Math.random_int(30, Config.screen_width - 30), Math.random_int(30, Config.screen_height - 30));
            }

            for (var i in this.cars)
            {
                var car = this.cars[i];
                var velocity = car.velocity;

                car.move();

                car.smoke(); // leave a trail of smoke

                //player car collision
                if (SAT.testPolygonPolygon(this.player.bounds, car.bounds))
                {
                    this.game_over();
                }

                //car win_car collision
                if (SAT.testPolygonPolygon(car.bounds, this.win_car.bounds, response))
                {
                    var bounce = response.overlapN;
                    response.a.pos.sub(response.overlapV);

                    var normal_len = bounce.dot(car.velocity);
                    var normal = {x: bounce.x * normal_len, y: bounce.y * normal_len};
                    var new_velocity = new Vector(car.velocity.x - 2 * normal.x, car.velocity.y - 2 * normal.y);
                    var angle = Math.get_angle_between_vectors(car.velocity, new_velocity);
                    car.velocity = new_velocity;

                    car.rotate(angle);

                    response.clear();
                }

                //car market collision
                if (SAT.testPolygonPolygon(car.bounds, this.market, response))
                {
                    var bounce = response.overlapN;
                    response.a.pos.sub(response.overlapV);

                    var normal_len = bounce.dot(car.velocity);
                    var normal = {x: bounce.x * normal_len, y: bounce.y * normal_len};
                    var new_velocity = new Vector(car.velocity.x - 2 * normal.x, car.velocity.y - 2 * normal.y);
                    var angle = Math.get_angle_between_vectors(car.velocity, new_velocity);
                    car.velocity = new_velocity;

                    car.rotate(angle);

                    response.clear();
                }

                //car car collision
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

        this.hud.update();
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
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
                this.player.set_position(p.x, p.y);
            //this.player.set_position(p.x + this.player_speed,p.y + this.player_speed);
            return;
        }

        if (this.is_right && this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(45);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
                this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_left && this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(225);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
                this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_left && this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(-45);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
                this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_down)
        {
            var p = this.player.get_position();
            this.player.rotate_to(180);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
                this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_up)
        {
            var p = this.player.get_position();
            this.player.rotate_to(0);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
                this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_left)
        {
            var p = this.player.get_position();
            this.player.rotate_to(-90);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
                this.player.set_position(p.x, p.y);
            return;
        }

        if (this.is_right)
        {
            var p = this.player.get_position();
            this.player.rotate_to(90);
            p.add(this.player.velocity.clone().scale(Ticker.step));
            //in of screen
            if (p.x < Config.screen_width && p.x > 0 && p.y < Config.screen_height && p.y > 0)
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
