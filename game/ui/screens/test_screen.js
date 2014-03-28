(function(window, undefined) {

    function TestScreen() {
        this.initialize();
    }

    TestScreen.prototype = new Screen();
    TestScreen.prototype.screen_initialize = TestScreen.prototype.initialize;
    TestScreen.prototype.initialize = function() {
        this.screen_initialize();

        var Box = SAT.Box;
        var V = SAT.Vector;

        this.box1 = new Box(new V(100, 100), 200, 100).toPolygon();
        //this.box1.setOffset({x:100,y:50});
        this.box1.translate(-100, -50);
        //this.box1.rotate(Math.degrees_to_radians(30));
        this.box1.translate(100, 50);
        //this.box1.setOffset({x:-100,y:-50});


        this.box2 = new Box(new V(220, 180), 200, 100).toPolygon();
        //this.box1.setOffset({x:100,y:50});
        this.box2.translate(-100, -50);
        this.box2.rotate(Math.degrees_to_radians(45));
        this.box2.translate(100, 50);
        //this.box1.setOffset({x:-100,y:-50});


        log(this.box);

        this.one = true;



    };

    TestScreen.prototype.on_mouse_up = function(event) {
        Drawable.prototype.on_mouse_up.call(this, event);


        log(SAT.pointInPolygon(event.point, this.box));

    };

    TestScreen.prototype.show = function() {
        Screen.prototype.show.call(this);

    };

    TestScreen.prototype.hide = function() {
        Screen.prototype.hide.call(this);

    };

    TestScreen.prototype.update = function() {
        Screen.prototype.update.call(this);

        var v = new SAT.Vector(0.5, 0.5);

        //  this.box.pos.add(v);
        //

    };

    TestScreen.prototype.on_added_to_parent = function(parent) {
        Drawable.prototype.on_added_to_parent.call(this, parent);

        game.input.add(this);

    };

    TestScreen.prototype.on_remove_from_parent = function(parent) {
        Drawable.prototype.on_remove_from_parent.call(this, parent);

    };

    TestScreen.prototype.draw = function(context) {


        context.beginPath();

        if (this.one)
        {
            var response = new SAT.Response();
            

            log(SAT.testPolygonPolygon(this.box2, this.box1, response));
            log(response.overlapV);
            log(response.overlapN);

            //this.box2.pos.sub(response.overlapV);

            this.one = false;
        }

        var points = this.box1.points;

        var pos = this.box1.pos;

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

        points = this.box2.points;

        pos = this.box2.pos;

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

    };

    TestScreen.prototype.clear = function(context) {

    };

    window.TestScreen = TestScreen;

}(window));