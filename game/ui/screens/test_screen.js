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

        this.box = new Box(new V(100, 100), 200, 100).toPolygon();
        //this.box.setOffset({x:100,y:50});
        this.box.translate(-100,-50);
        this.box.rotate(Math.toRadians(30));
        this.box.translate(100,50);
        //this.box.setOffset({x:-100,y:-50});
        
        log(this.box);



    };
   
    TestScreen.prototype.on_mouse_up = function(event){
        Drawable.prototype.on_mouse_up.call(this,event);
        
        
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
        
        var v = new SAT.Vector(0.5,0.5);
        
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

        var points = this.box.points;

        var pos = this.box.pos;

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