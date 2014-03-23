//(function(window, undefined) {

    function Drawable() {
        this.initialize();
    }
    Drawable.prototype.initialize = function() {

        this.position = new Vector(0,0);
        this.anchor = new Vector(0,0);
        
        this.width = 0;
        this.height = 0;
        this.radius = 0;
        this.angle = 0;
        
        this.reg = {x:0,y:0};
        
        this.bounds_type = 'Rect';
        this.bounds = new Box(this.position,this.width,this.height).toPolygon(); // new Rect(this.position, this.width, this.height);
        this.is_mouse_down = false;
        this.is_selected = false;
        
        this.tag = 0;
        this.z_index = 1;        
        this.priority = 0;

        this.parent = null;
        this.children = [];
        this.is_children_sortable = true;
        
    };
    
    Drawable.prototype.set_position = function(x,y) {
        this.position.x = x;
        this.position.y = y;

        var ap = this.get_absolute_position();
       
        //todo different for circle bounds
        if (ap) {
           
            this.set_bounds_position(ap);
            this.iterate_children(this,ap);
        }
    };
    
    Drawable.prototype.set_anchor = function(x,y){
        this.anchor.x = x;
        this.anchor.y = y;
        this.reg.x = -x*this.width;
        this.reg.y = -y*this.height;
        
        this.bounds.translate(this.reg.x,this.reg.y);
    };
    
    Drawable.prototype.rotate_to = function(angle){   
        var a = angle - this.angle;
        this.angle = angle;
        this.bounds.rotate(Math.degrees_to_radians(a));
    };


    Drawable.prototype.add_child = function(child) {
        child.parent = this;
        child.on_added_to_parent(this);
        this.children.push(child);
    };

    Drawable.prototype.remove_child = function(child) {
        var index = this.children.indexOf(child);
        if(index !== -1){
            child.on_remove_from_parent(this);        
            this.children.splice(index, 1);
            this.dispatch_on_remove_children(child);
        }
        
    };
    
    Drawable.prototype.dispatch_on_remove_children = function(parent){
      
        var children = parent.get_children();
        var i = children.length;
        while (i--) {
            var child = children[i];
            child.on_remove_from_parent(parent);
            child.dispatch_on_remove_children(child);
           // this.remove_children(child);
        }
        
    };

    Drawable.prototype.get_children = function() {
        return this.children;
    };

    Drawable.prototype.get_parent = function() {
        return this.parent;
    };

    Drawable.prototype.remove_from_parent = function() {
        var parent = this.get_parent();
        if(parent){
            this.get_parent().remove_child(this);
        }
    };
    
    Drawable.prototype.on_added_to_parent = function(parent) {
        // recalculate the bounds of the children
        var position = this.get_absolute_position();
        this.set_bounds_position(position);
        this.iterate_children(this,position);
    };
    
    Drawable.prototype.on_remove_from_parent = function(parent){
        
    };
    
    Drawable.prototype.iterate_children = function(parent,position){
        
        var children = parent.get_children();
        var count = children.length;
        
        for(var i=0;i<count;i++){
           
            var child = children[i];
            var p = child.get_position();
            p.add(position);
            child.set_bounds_position(p);
            child.on_added_to_parent(parent);
        }
        
        
    };

//    Drawable.prototype.get_top = function() {
//        return this.position.y;
//    };
//    Drawable.prototype.get_bottom = function() {
//        return this.position.y + this.height;
//    };
//    Drawable.prototype.get_left = function() {
//        return this.position.x;
//    };
//    Drawable.prototype.get_right = function() {
//        return this.position.x + this.width;
//    };
//    Drawable.prototype.get_center = function() {
//        return {x: this.position.x + this.width / 2 , y: this.position.y + this.height / 2};
//    };
//    
//    Drawable.prototype.set_center = function(position){
//        
//        this.set_position({x:(position.x - this.width/2),y:(position.y - this.height/2)});        
//        
//    };

    
    
    Drawable.prototype.get_anchor = function(){
        return this.anchor;
    };

    Drawable.prototype.get_position = function() {
        return this.position.clone();
    };
    
    Drawable.prototype.get_calculated_position = function(){
        
        return Vector.addition(this.bounds.pos,this.reg);
        
    };
    
    Drawable.prototype.get_absolute_position = function() {
        //return this.position;
        if (this.parent) {           
            return this.iterate_parents(this.parent);
        } else {
            return this.get_position();
        }

    };
    
    Drawable.prototype.to_relative_position = function(point){       
        return point.clone().sub(this.bounds.pos);
    };

    Drawable.prototype.iterate_parents = function(child) {
        var parent = child.parent;

        if (parent) {

            var p1 = child.get_position();
            var p2 = this.iterate_parents(parent);

            var v = new Vector(p1.x,p1.y);
            return v.add(p2);

        } else {
            return this.position;
        }

    };



    Drawable.prototype.on_mouse_down = function(event) {};
    Drawable.prototype.on_mouse_up = function(event) {};
    Drawable.prototype.on_mouse_move = function(event) {};
    Drawable.prototype.on_mouse_cancel = function() {};
    
    Drawable.prototype.on_right_mouse_down = function(event) {};
    Drawable.prototype.on_right_mouse_up = function(event) {};
    Drawable.prototype.on_right_mouse_move = function(event) {};

    Drawable.prototype.resign_event_to_parent = function(event,event_type){
        
        this.is_mouse_down = false;
        var parent = this.get_parent();
        if(parent){
            parent.is_mouse_down = true;
            
            if(event_type == 'on_mouse_down'){
                parent.on_mouse_down(event);
            }else if(event_type == 'on_mouse_move'){
                parent.on_mouse_move(event);
            }else if(event_type == 'on_mouse_up'){
                parent.on_mouse_up(event);
            }
            
            
        }else{
            console.log("no parent found to resign the event");
        }
    };

    Drawable.prototype.recalculate_bounds = function() {

        if (this.bounds_type === 'Circle') {

            this.bounds.pos = this.position.clone();
            this.bounds.radius = this.radius;

        } else if(this.bounds_type === 'Rect') {           
            this.bounds = new Box(this.position.clone(),this.width,this.height).toPolygon();
        }
    };
    
    Drawable.prototype.set_bounds_type = function(type){
        this.bounds_type = type;
        if(type === 'Circle'){
            this.bounds = new Circle(this.position,this.radius);
        }else if(type==='Rect'){
            this.bounds = new Rect(this.position,this.width,this.height);
        }
    };
    
    Drawable.prototype.set_bounds = function(position,size){
        
            this.bounds.pos = position.clone();
            
            if(this.bounds_type === 'Rect'){
                this.bounds.width = size.width;
                this.bounds.height = size.height;
            }else if(this.bounds_type === 'Circle'){
                this.bounds.radius = size.width/2;
            }
    };
    
    Drawable.prototype.set_bounds_size = function(size){
        if(this.bounds_type === 'Rect'){
            this.bounds.width = size.width;
            this.bounds.height = size.height;
        }else if(this.bounds_type === 'Circle'){
            this.bounds.radius = size.width/2;
        }
    };
    
    Drawable.prototype.set_bounds_position = function(position){
        this.bounds.pos = position.clone();
    };
    
    Drawable.prototype.set_size = function(width,height) {
        this.width = width;
        this.height = height;
        this.radius = width/2;
        this.recalculate_bounds();
    };

    


    Drawable.prototype.check = function(point) {

        if(this.bounds_type === 'Rect'){
            return SAT.pointInPolygon(point, this.bounds);
        }else{
            return SAT.pointInCircle(point, this.bounds);
        }   
       
    };

    Drawable.prototype.draw = function(ctx) {
        throw "you must implment draw method for drawable";
    };
    
    Drawable.prototype.debug_bounds = function(context){
        
        var points = this.bounds.points;

        var pos = this.bounds.pos;
        
        context.beginPath();

        for (var i = 0; i < points.length; i++) {

            if (i == points.length - 1) {
                var p1 = points[0].clone();
                var p2 =points[i].clone();
            } else {
                var p1 = points[i].clone();
                var p2 = points[i + 1].clone();
            }

            p1.add(pos);
            p2.add(pos);
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
        }


        context.closePath();

        context.stroke();
        
        context.beginPath();
        context.arc(pos.x,pos.y,2,0,2*Math.PI);
        context.fill();
        context.closePath();
        
    };

    Drawable.prototype.on_draw_finished = function(ctx) {};

    Drawable.prototype.clear = function(ctx) {
        throw "you must implment clear from canvas method for drawable";
    };
    
    //-------------------------------------------------
    // state machine methods
    
    Drawable.prototype.on_state = function(prev_state,current_state,data){
        
    };

  //  window.Drawable = Drawable;

//}(window));