//(function(window, undefined) {

    function Drawable() {
        this.initialize();
    }
    Drawable.prototype.initialize = function() {

        this.position = {x: 0, y: 0};
        this.width = 0;
        this.height = 0;
        this.radius = 0;
        this.bounds_type = 'Rect';
        this.bounds = new Rect(this.position, this.width, this.height);
        this.is_mouse_down = false;
        this.is_selected = false;
        this.tag = 0;
        this.z_index = 1;
        
        this.priority = 0;

        this.reg = {x: 0, y: 0};
        this.children = [];
        this.is_children_sortable = true;
        this.parent = null;
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
            var ap = {x: p.x + position.x, y: p.y + position.y};
           // console.log(ap);
            //child.set_bounds(ap,{width:child.width,height:child.height});
            child.set_bounds_position(ap);
            child.on_added_to_parent(parent);
        }
        
        
    };

    Drawable.prototype.get_top = function() {
        return this.position.y;
    };
    Drawable.prototype.get_bottom = function() {
        return this.position.y + this.height;
    };
    Drawable.prototype.get_left = function() {
        return this.position.x;
    };
    Drawable.prototype.get_right = function() {
        return this.position.x + this.width;
    };
    Drawable.prototype.get_center = function() {
        return {x: this.position.x + this.width / 2 , y: this.position.y + this.height / 2};
    };
    
    Drawable.prototype.set_center = function(position){
        
        this.set_position({x:(position.x - this.width/2),y:(position.y - this.height/2)});        
        
    };

    Drawable.prototype.set_position = function(position) {
        this.position.x = position.x;
        this.position.y = position.y;

        var ap = this.get_absolute_position();

        //todo different for circle bounds
        if (ap) {
           
            this.set_bounds_position(ap);
            this.iterate_children(this,ap);
        }
    };
    
    Drawable.prototype.set_reg = function(reg){
        this.reg.x = this.width * reg.x;
        this.reg.y = this.height * reg.y;
        this.bounds.set_reg(reg);
    };
    
    Drawable.prototype.get_reg = function(){
        return this.reg;
    };

    Drawable.prototype.get_position = function() {
        return this.position;
    };
    
    Drawable.prototype.get_absolute_position = function() {
        //return this.position;
        if (this.parent) {
            return this.iterate_parents(this.parent);
        } else {
            this.get_position();
        }

    };
    
    Drawable.prototype.to_relative_position = function(point){
        var absolute = this.bounds.get_position(); // the bounds have the absolute position
        return {x: point.x - absolute.x,y: point.y - absolute.y};
    };

    Drawable.prototype.iterate_parents = function(child) {
        var parent = child.parent;

        if (parent) {

            var p1 = child.get_position();
            var p2 = this.iterate_parents(parent);

            return {x: p1.x + p2.x, y: p1.y + p2.y};

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

            this.bounds.set_position(this.position);
            this.bounds.radius = this.radius;

        } else if(this.bounds_type === 'Rect') {
            this.bounds.set_position(this.position);
            this.bounds.width = this.width;
            this.bounds.height = this.height;
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
        
            this.bounds.set_position(position);
            
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
        this.bounds.set_position(position);
    };
    
    Drawable.prototype.set_size = function(size) {
        this.width = size.width;
        this.height = size.height;
        this.radius = size.width/2;
        this.recalculate_bounds();
    };

    


    Drawable.prototype.check = function(point) {

        return Collision.detect(this.bounds, point);
    };

    Drawable.prototype.draw = function(ctx) {
        throw "you must implment draw method for drawable";
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