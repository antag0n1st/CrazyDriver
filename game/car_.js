(function(window, undefined) {

    function Car() {
        this.initialize();
    }

    Car.prototype = new Animation();
    Car.prototype.animation_initialize = Car.prototype.initialize;
    Car.prototype.initialize = function() {

        var sprite_sheet = new SpriteSheet([{
                image: ContentManager.images.car_animation,
                frames: {x: 2, y: 1},
                animations: {
                    drive: {start: 0, end: 1, loop: true, duration: 300}
                }
                , reg: {x: 0.5, y: 0.5, width: 1.0, height: 1.0}
            }]);

        this.animation_initialize(sprite_sheet);

        // this.image = ContentManager.images.car.image;

        this.start_position = {x: 0, y: 0};
        this.end_position = {x: 0, y: 0};
        this.speed = 100 / 1000;
        this.angle = 0;
        this.current_angle = 0;
        
        this.factor_w=0.7;
        this.factor_h=0.4;

        this.collider = new SAT.Box(new SAT.Vector(0, 0), this.image.width * this.factor_w, this.image.height * this.factor_h).toPolygon();
        this.collider.translate(-this.image.width*this.factor_w / 2, -this.image.height*this.factor_h / 2);

        this.smoke_frequency = 20/1000; // per second
        this.smoke_count = 0;
        this.smoke_time = 0;

        this.callback = function(){};
    };
    
    Car.prototype.smoke = function(){
        
        this.smoke_time += Ticker.step;
        
        
        var tp = Math.round(this.smoke_time * this.smoke_frequency);
        
        var particles_to_emit = tp - this.smoke_count;
        
        this.smoke_count = tp;
        
        for(var i=0;i<particles_to_emit;i++){
            
                var r1 = Math.random_int(0,6);
                var r2 = Math.random_int(0,6);

                var angle = Math.get_angle(this.collider.pos,this.start_position);
                var back_point = Math.get_next_point(this.collider.pos,35,angle);

                back_point.x += r1 - 3;
                back_point.y += r2 - 3;

                var smoke = new Smoke();

                smoke.set_position(back_point);
                this.get_parent().add_child(smoke); // the smoke will be a sibling
        }
        
        
       
        
        
    };

    Car.prototype.on_added_to_parent = function(parent) {
        Animation.prototype.on_added_to_parent.call(this, parent);
        this.play("drive");
    };

    Car.prototype.on_remove_from_parent = function(parent) {
        Animation.prototype.on_remove_from_parent.call(this, parent);

    };

    Car.prototype.draw = function(context) {

//        context.save();
//
//        var center = this.bounds.get_center();
//        var xx = center.x;
//        context.translate(xx, center.y);
//        context.rotate((this.angle + 90) * Math.PI / 180);
//        context.translate(-xx, -center.y);
        Animation.prototype.draw.call(this, context);
//
//        context.restore();
//
//        //##########################
//        
//        if(Config.debug){
//            context.beginPath();
//
//        var points = this.collider.points;
//
//        var pos = this.collider.pos;
//
//        for (var i = 0; i < points.length; i++) {
//
//            if (i == points.length - 1) {
//                var p1 = new SAT.Vector().copy(points[0]);
//                var p2 = new SAT.Vector().copy(points[i]);
//            } else {
//                var p1 = new SAT.Vector().copy(points[i]);
//                var p2 = new SAT.Vector().copy(points[i + 1]);
//            }
//
//
//
//            p1.add(pos);
//            p2.add(pos);
//            context.moveTo(p1.x, p1.y);
//            context.lineTo(p2.x, p2.y);
//        }
//
//
//        context.closePath();
//
//        context.stroke();
//            
//        }
        
        

    };

    Car.prototype.clear = function(context) {

    };

    Car.prototype.reset_position = function(points)
    {
        this.start_position = points[0];
        this.end_position = points[1];

        this.set_position(this.start_position);

        this.angle = Math.get_angle(this.start_position, this.end_position);

        var angle_rotate = Math.degrees_to_radians(this.angle) - Math.degrees_to_radians(this.current_angle);

        this.current_angle = this.angle;
       
        this.collider.rotate(angle_rotate);
    };

    Car.prototype.move = function() {
        var p = this.get_position();

        var distance = this.speed * Ticker.step;
        var next = Math.get_next_point(p, distance, this.angle);

        var total_distance = Math.get_distance(this.start_position, this.end_position);
        var current_distance = Math.get_distance(this.start_position, next);

        if (current_distance <= total_distance)
        {
            this.set_position(next);
        }
        else
        {
            this.callback(this);
        }
    };

    Car.prototype.set_position = function(point)
    {
        Drawable.prototype.set_position.call(this, point);

        this.collider.pos = new SAT.Vector(point.x, point.y);
    };

    window.Car = Car;

}(window));