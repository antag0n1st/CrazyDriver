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
        
        ContentManager.sounds.car.volume(0.01).loop(true).play();

        this.win_car_poss = [{x: 46, y: 50}, {x: 100, y: 50}, {x: 152, y: 50}, {x: 204, y: 50}, {x: 46, y: 180}, {x: 46, y: 250}];

        this.win_car_pos = Math.random_int(0, 5);
        this.win_car_start_angle = Math.random_int(0, 1);

        this.win_car = new WinCar();
        this.bonus = new Bonus();

        this.pointer = new Pointer();
        
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
        this.add_child(this.pointer);

        this.kibo = new Kibo();

        this.is_down = false;
        this.is_up = false;
        this.is_left = false;
        this.is_right = false;

        this.is_game_over = false;
        this.is_level_win = false;
        this.state = 0;
        this.animation_state = '';

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
        
        this.kibo.up(['space'], function() {
            that.space_pressed();
        });

        this.reset_game_objects();


    };
    
    GameScreen.prototype.space_pressed = function(){
        if(this.is_game_over && this.is_level_win){
            this.win_alert.remove_from_parent();
            this.on_next_level();
        }else if(this.is_game_over){
            this.over_alert.remove_from_parent();
            this.on_restart_game();
        }
    };

    GameScreen.prototype.reset_game_objects = function() {

        var num = this.start_cars + this.level;
        var that = this;

        var pps = this.win_car_poss[this.win_car_pos];
        this.win_car.set_position(pps.x, pps.y);
        
        if(this.level === 1){            
            this.pointer.set_position(pps.x + 130,pps.y+30);  
            this.pointer.rotate_to(180);
        }
        

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
        
        ContentManager.sounds.crash.volume(0.5).play();
        
       // this.points = 0;
        this.hud.points = this.points;
      //  this.level = 1;
      //  this.hud.level = 1;
        this.level_points = 100;
        this.hud.level_points = this.level_points;
        this.state = 0;
        this.animation_state = '';
        
        this.is_game_over = true;
        this.player.play("idle"+this.animation_state);
        this.player.is_waling = false;
        this.player.sound.stop();
        
       // this.add_child(this.over_alert);
       var end_pos = this.over_alert.get_position();
       this.over_alert.set_position(end_pos.x,600);
       this.add_child(this.over_alert);
       var tween = new Tween(this.over_alert,end_pos,new Bezier(.14,1.07,.7,1.41),400,function(){});
       tween.run();
    };

    GameScreen.prototype.game_win = function() {
        
        ContentManager.sounds.win.volume(0.6).play();
        
        this.points = this.points + this.level_points;
        this.hud.points = this.points;
        this.level_points = 100;
        this.state = 0;
        this.animation_state = '';
        this.is_game_over = true;
        this.player.play("idle"+this.animation_state);
        this.player.is_waling = false;
        this.player.sound.stop();
        this.win_alert.level = this.level;
        this.win_alert.points = this.points;
        if(this.level === 1){
            this.pointer.remove_from_parent();
        }
        
       var end_pos = this.win_alert.get_position();
       this.win_alert.set_position(end_pos.x,600);
       this.add_child(this.win_alert);
       var tween = new Tween(this.win_alert,end_pos,new Bezier(.14,1.07,.7,1.41),400,function(){});
       tween.run();
       
        this.is_level_win = true;
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
        this.is_level_win = false;
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
                if (this.state == 0){
                    this.state = 1;
                    
                    ContentManager.sounds.appear.volume(0.7).play();
                    
                    var car_message = new CarReachedMessage();
                    car_message.z_index = 20;
                    car_message.set_position(-200,250);
                    this.add_child(car_message);
                    
                    var car_message_tween = new Tween(car_message,{x:400,y:250},new Bezier(.17,.67,.58,1.34),400,function(){
                       
                       var car_message_tween = new Tween(car_message,{x:400,y:250},new Bezier(1,1,1,1),1000,function(){

                            var car_message_tween = new Tween(car_message,{x:1000,y:250},new Bezier(1,1,1,1),300,function(){
                                this.object.remove_from_parent();
                            });
                            car_message_tween.run();

                        });
                        car_message_tween.run();
                       
                    });
                    car_message_tween.run();
                    
                    if(this.level === 1){
                        this.pointer.rotate_to(90);
                        this.pointer.set_position(580,350); 
                    }
                    this.animation_state = '_empty';
                    if(this.player.is_walking){
                        this.player.play("run"+this.animation_state);
                    }
                    
                }
                    
//
//                if (this.state == 2){
//                    this.game_win();
//                }
                    

                var resolve_pos = response.a.pos.clone();
                resolve_pos.sub(response.overlapV);
                this.player.set_position(resolve_pos.x, resolve_pos.y);

                
            }
            response.clear();

            //player market collision
            if (SAT.testPolygonPolygon(this.player.bounds, this.market,response))
            {
                if ( response.aInB && this.state == 1){
                   // this.state = 2;
                    this.game_win();
                }
                     
            }
            response.clear(); 

            //player bonus collision
            if (SAT.testPolygonPolygon(this.player.bounds, this.bonus.bounds))
            {
                
                ContentManager.sounds.collect.volume(0.2).play();
                
                var points = new Points();
                points.set_position(this.bonus.get_position().x,this.bonus.get_position().y);
                points.z_index = 20;
                this.add_child(points);
                var bonus_tween = new Tween(points,{x:points.position.x,y:points.position.y-80},new Bezier(.11,.77,.5,1),600,function(){
                    
                    var bonus_tween_alpha = new TweenAlpha(points,0,new Bezier(1,1,1,1),300,function(){
                        this.object.remove_from_parent();
                    });
                    bonus_tween_alpha.run();
                    
                });
                bonus_tween.run();
                
                this.bonus.set_position(Math.random_int(30, Config.screen_width - 30), Math.random_int(30, Config.screen_height - 30));
                this.level_points += 10;
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
                    car.set_position(response.a.pos.x,response.a.pos.y);

                    var normal_len = bounce.dot(car.velocity);
                    var normal = {x: bounce.x * normal_len, y: bounce.y * normal_len};
                    var new_velocity = new Vector(car.velocity.x - 2 * normal.x, car.velocity.y - 2 * normal.y);
                    var angle = Math.get_angle_between_vectors(car.velocity, new_velocity);
                    car.velocity = new_velocity;

                    car.rotate(angle);

                    
                }
                response.clear();

                //car market collision
                if (SAT.testPolygonPolygon(car.bounds, this.market, response))
                {
                    var bounce = response.overlapN;
                    response.a.pos.sub(response.overlapV);
                    car.set_position(response.a.pos.x,response.a.pos.y);

                    var normal_len = bounce.dot(car.velocity);
                    var normal = {x: bounce.x * normal_len, y: bounce.y * normal_len};
                    var new_velocity = new Vector(car.velocity.x - 2 * normal.x, car.velocity.y - 2 * normal.y);
                    var angle = Math.get_angle_between_vectors(car.velocity, new_velocity);
                    car.velocity = new_velocity;

                    car.rotate(angle);

                    
                }
                response.clear();

                //car car collision
                for (var j in this.cars)
                {
                    var another_car = this.cars[j];

                    if (car != another_car && SAT.testPolygonPolygon(car.bounds,another_car.bounds, response))
                    {
                        
                        response.a.pos.sub(response.overlapV);
                        car.set_position(response.a.pos.x,response.a.pos.y);
                        
                        var angle = Math.random_int(0, 30);
                        car.velocity.setAngle(Math.degrees_to_radians(car.angle - 15 + angle - 90));
                        car.rotate_to(car.angle - 15 + angle);

                        
                    }
                    
                    response.clear();
                }
            }
        }

        this.hud.update();
    };

    GameScreen.prototype.draw = function(context) {

        context.drawImage(this.back_image, 0, 0);
        if(Config.debug){
            Drawable.draw_polygon(this.market, context);
        }
        

    };

    GameScreen.prototype.update_movement = function() {
                
       if(!this.player.is_walking &&(this.is_right || this.is_down || this.is_up || this.is_left)){
            this.player.play("run"+this.animation_state);
            this.player.is_walking = true;
            this.player.sound.play();
       }
        

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

        if(this.player.is_walking){
            this.player.play("idle"+this.animation_state);
            this.player.is_walking = false;
            this.player.sound.pause();
        }
        
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
