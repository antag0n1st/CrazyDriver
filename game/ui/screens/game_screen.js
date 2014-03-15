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

        this.player.set_position({x: 100, y: 200});

        this.car_size;

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

        for (i = 0; i < 3; i++)
        {
            var car = new Car();
            car.callback = GameScreen.prototype.car_callback.bind(this);

            this.car_size = Math.sqrt(Math.pow(car.bounds.width, 2) + Math.pow(car.bounds.height, 2));


            var points = this.generate_random_points();

            car.start_position = points[0];
            car.end_position = points[1];

            car.set_position(car.start_position);

            this.add_child(car);

            this.cars.push(car);
        }

    };

    GameScreen.prototype.generate_random_points = function()
    {
        var points = [];
        var start_side = Math.random_in_range(0, 3);
        var end_side = Math.random_in_range(0, 3);
        while (start_side == end_side)
        {
            end_side = Math.random_in_range(0, 3);
        }

        if (start_side == 0 || end_side == 0)
        {
            points.push({x: Config.screen_width + this.car_size,
                y: Math.random_in_range(-this.car_size, Config.screen_height + this.car_size)});
        }

        if (start_side == 1 || end_side == 1)
        {
            points.push({x: Math.random_in_range(-this.car_size, Config.screen_width + this.car_size),
                y: Config.screen_height + this.car_size});
        }

        if (start_side == 2 || end_side == 2)
        {
            points.push({x: -this.car_size,
                y: Math.random_in_range(-this.car_size, Config.screen_height + this.car_size)});
        }

        if (start_side == 3 || end_side == 3)
        {
            points.push({x: Math.random_in_range(-this.car_size, Config.screen_width + this.car_size),
                y: -this.car_size});
        }

        return points;
    }

    GameScreen.prototype.car_callback = function(car)
    {
        var points = this.generate_random_points();

        car.start_position = points[0];
        car.end_position = points[1];
        
        car.set_position(car.start_position);
    };

    GameScreen.prototype.game_over = function() {
        this.is_game_over = true;
    };

    GameScreen.prototype.update = function() {

        this.update_movement();

        for (var i in this.cars)
        {
            this.cars[i].move();
        }

    };

    GameScreen.prototype.draw = function(context) {

        context.drawImage(this.back_image, 0, 0);

    };

    GameScreen.prototype.update_movement = function() {

        if (this.is_right && this.is_down)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x + this.player_speed, y: p.y + this.player_speed});
            return;
        }

        if (this.is_right && this.is_up)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x + this.player_speed, y: p.y - this.player_speed});
            return;
        }

        if (this.is_left && this.is_down)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x - this.player_speed, y: p.y + this.player_speed});
            return;
        }

        if (this.is_left && this.is_up)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x - this.player_speed, y: p.y - this.player_speed});
            return;
        }

        if (this.is_down)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x, y: p.y + this.player_speed});
            return;
        }

        if (this.is_up)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x, y: p.y - this.player_speed});
            return;
        }

        if (this.is_left)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x - this.player_speed, y: p.y});
            return;
        }

        if (this.is_right)
        {
            var p = this.player.get_position();
            this.player.set_position({x: p.x + this.player_speed, y: p.y});
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