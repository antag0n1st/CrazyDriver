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

        this.callback = function() {
        };
    };

    Car.prototype.on_added_to_parent = function(parent) {
        Animation.prototype.on_added_to_parent.call(this, parent);
        this.play("drive");
    };

    Car.prototype.on_remove_from_parent = function(parent) {
        Animation.prototype.on_remove_from_parent.call(this, parent);

    };

    Car.prototype.draw = function(context) {

        context.save();

        var center = this.bounds.get_center();
        var xx = center.x;
        context.translate(xx, center.y);
        context.rotate((this.angle + 90) * Math.PI / 180);
        context.translate(-xx, -center.y);
        Animation.prototype.draw.call(this, context);

        context.restore();

    };

    Car.prototype.clear = function(context) {

    };

    Car.prototype.move = function() {
        var p = this.get_position();
        var angle = this.angle = Math.get_angle(this.start_position, this.end_position);
        var distance = this.speed * Ticker.step;
        var next = Math.get_next_point(p, distance, angle);

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

    window.Car = Car;

}(window));