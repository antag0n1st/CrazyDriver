//(function(window, undefined) {

    function Sprite(image_name) {
        if(image_name){
            this.initialize(image_name);
        }        
    }

    Sprite.prototype = new Drawable();
    Sprite.prototype.drawable_initialize = Sprite.prototype.initialize;
    Sprite.prototype.initialize = function(image_name) {
        this.drawable_initialize();
        
        this.image = ContentManager.images[image_name].image;
        this.set_size(this.image.width, this.image.height);
       
    };

    Sprite.prototype.on_added_to_parent = function(parent) {
        Drawable.prototype.on_added_to_parent.call(this, parent);

    };

    Sprite.prototype.on_remove_from_parent = function(parent) {
        Drawable.prototype.on_remove_from_parent.call(this, parent);

    };
    
    Sprite.prototype.on_draw = function(context){};

    Sprite.prototype.draw = function(context) {

        var w = this.width;
        var h = this.height;
        //var reg = this.reg;

        //var pos = this.get_calculated_position();
        var anchor = this.bounds.pos;
        var ach = this.get_anchor();
        var pos = this.bounds.pos.clone().add(new Vector(-w * ach.x, -h * ach.y));

        
        if (this.is_visible) {
            
            var alpha = context.globalAlpha;

            if (this.angle !== 0) {
                context.save();
                context.translate(anchor.x, anchor.y);
                context.rotate(Math.degrees_to_radians(this.angle));
                context.translate(-anchor.x, -anchor.y);
            }
            
            if(this.alpha !== 1){
                context.globalAlpha = this.alpha;
            }
            
            var new_width = this.width*this.scale_x;
            var new_height = this.height *this.scale_y;
            
            context.drawImage(this.image,
            pos.x - ach.x*( new_width - this.width ),
            pos.y - ach.y*( new_height - this.height ),
            new_width,
            new_height);
            
            this.on_draw(context);
            
            if(this.alpha !== 1){
                context.globalAlpha = alpha;
            }

            if (this.angle !== 0) {
                context.restore();
            }
        }
        
        if(Config.debug){
            this.debug_bounds(context);
        }
        
    };
    
    Sprite.prototype.clear = function(context) {

    };

    window.Sprite = Sprite;

//}(window));