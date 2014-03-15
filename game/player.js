(function(window, undefined) {

    function Player() {
        this.initialize();
    }

    Player.prototype = new Animation();
    Player.prototype.animation_initialize = Player.prototype.initialize;
    Player.prototype.initialize = function() {

        var sprite_sheet = new SpriteSheet([{
                image: ContentManager.images.player,
                frames: {x: 8, y: 1},
                animations: {
                    run: {start: 0, end: 7, loop: true, duration: 800},
                    idle: {start: 2, end: 2, loop: true, duration: 100}
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
        
        this.factor_w=0.9;
        this.factor_h=0.4;
        
        this.play("run");

        this.collider = new SAT.Box(new SAT.Vector(0, 0), this.width * this.factor_w, this.height * this.factor_h).toPolygon();
        this.collider.translate(-this.width*this.factor_w / 2, -this.height*this.factor_h / 2);

        this.callback = function() {
        };
    };

    Player.prototype.on_added_to_parent = function(parent) {
        Animation.prototype.on_added_to_parent.call(this, parent);
        this.play("drive");
    };

    Player.prototype.on_remove_from_parent = function(parent) {
        Animation.prototype.on_remove_from_parent.call(this, parent);

    };

    Player.prototype.draw = function(context) {

        context.save();

        var center = this.bounds.get_center();
        var xx = center.x;
        context.translate(xx, center.y);
        context.rotate((this.angle + 90) * Math.PI / 180);
        context.translate(-xx, -center.y);
        Animation.prototype.draw.call(this, context);

        context.restore();

        //##########################
        
        if(Config.debug){
            context.beginPath();

        var points = this.collider.points;

        var pos = this.collider.pos;

        for (var i = 0; i < points.length; i++) {

            if (i == points.length - 1) {
                var p1 = new SAT.Vector().copy(points[0]);
                var p2 = new SAT.Vector().copy(points[i]);
            } else {
                var p1 = new SAT.Vector().copy(points[i]);
                var p2 = new SAT.Vector().copy(points[i + 1]);
            }



            p1.add(pos);
            p2.add(pos);
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
        }


        context.closePath();

        context.stroke();
        }

        

    };

    Player.prototype.clear = function(context) {

    };

    Player.prototype.move = function() {
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

    Player.prototype.set_position = function(point)
    {
        Drawable.prototype.set_position.call(this, point);

        this.collider.pos = new SAT.Vector(point.x, point.y);
        
        var angle_rotate = Math.toRadians(this.angle) - Math.toRadians(this.current_angle);

        this.current_angle = this.angle;
       
        this.collider.rotate(angle_rotate);
    };

    window.Player = Player;

}(window));