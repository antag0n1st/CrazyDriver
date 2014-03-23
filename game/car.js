(function(window, undefined){

function Car(){
this.initialize();
}

Car.prototype = new Animation();
        Car.prototype.animation_initialize = Car.prototype.initialize;
        Car.prototype.initialize = function(){

        var sprite_sheet = new SpriteSheet([{
        image: ContentManager.images.car_animation,
                frames: {x: 2, y: 1},
                animations: {
                drive: {start: 0, end: 1, loop: true, duration: 300}
                }
        , reg: {x: 0.5, y: 0.5, width: 0.7, height: 0.8}
        }]);
                this.animation_initialize(sprite_sheet);
                this.emiter_point = new Vector(5, 35);
                this.velocity = new Vector(0, 0);
                this.velocity.setLength(2);
                this.rotation = 50 / 1000;
                this.car_size = this.image.width;
                this.smoke_frequency = 20 / 1000; // per second
                this.smoke_count = 0;
                this.smoke_time = 0;
                this.callback = function(){};
        };
        Car.prototype.reset_position = function(points)
        {
        this.start_position = points[0];
                this.end_position = points[1];
                this.set_position(this.start_position.x, this.start_position.y);
                var angle = Math.get_angle(this.start_position, this.end_position);
                this.velocity.setAngle(Math.degrees_to_radians(angle));
                this.rotate_to(angle + 90);
        };
        Car.prototype.move = function(){

        var pos = this.bounds.pos.clone();
                pos.add(this.velocity);
                this.set_position(pos.x, pos.y);
                var distance_traveled = Math.get_distance(this.start_position, pos);
                var distance_to_travel = Math.get_distance(this.start_position, this.end_position);
                if (distance_traveled >= distance_to_travel){
        if (this.bounds.pos.x - this.car_size > Config.screen_width || this.bounds.pos.x + + this.car_size < 0
                || this.bounds.pos.y - this.car_size > Config.screen_height || this.bounds.pos.y + this.car_size < 0)
                this.callback(this);
        }

        };
        Car.prototype.on_mouse_up = function(event){
        log("plane");
        };
        Car.prototype.smoke = function(){

        this.smoke_time += Ticker.step;
                var tp = Math.round(this.smoke_time * this.smoke_frequency);
                var particles_to_emit = tp - this.smoke_count;
                this.smoke_count = tp;
                for (var i = 0; i < particles_to_emit; i++){

        var r1 = Math.random_int(0, 6);
                var r2 = Math.random_int(0, 6);
                var pos = this.bounds.pos;
                var anchor = Vector.addition(pos, this.emiter_point);
                anchor.x += r1 - 3;
                anchor.y += r2 - 3;
                var smoke = new Smoke();
                smoke.set_position(anchor.x, anchor.y);
                this.get_parent().add_child(smoke); // the smoke will be a sibling
        }


        this.play('drive');


     };
        Car.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this, parent);
        };
        Car.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this, parent);
        };
        Car.prototype.draw = function(context){
        Animation.prototype.draw.call(this, context);
                if (Config.debug){
        var pos = this.bounds.pos;
                var anchor = Vector.addition(pos, this.emiter_point);
                context.fillStyle = "yellow";
                context.beginPath();
                context.arc(anchor.x, anchor.y, 2, 0, 2 * Math.PI);
                context.fill();
                context.closePath();
                context.fillStyle = "black";
                this.debug_bounds(context);
        }


        };
        Car.prototype.rotate_to = function(angle){

        var a = angle - this.angle;
                Drawable.prototype.rotate_to.call(this, angle);
                this.emiter_point.rotate(Math.degrees_to_radians(a));
        };
        Car.prototype.clear = function(context){

        };
        window.Car = Car;
        }(window));