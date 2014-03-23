(function(window, undefined) {

    function Hud() {
        this.initialize();
    }

    Hud.prototype = new Drawable();
    Hud.prototype.drawable_initialize = Hud.prototype.initialize;
    Hud.prototype.initialize = function() {
        this.drawable_initialize();

        this.set_size(Config.screen_width, 50);
        
        this.level;
        this.level_points;
        this.points;

        this.level_label = new Label();
        this.level_label.set({
            text: "Level: ",
            text_align: "left",
            text_valign: 'middle',
            text_color: "white",
            text_size: 16
        });
        this.level_label.set_position(10, 20);
        
        this.level_points_label = new Label();
        this.level_points_label.set({
            text: "Level points: ",
            text_align: "left",
            text_valign: 'middle',
            text_color: "white",
            text_size: 16
        });
        this.level_points_label.set_position(120, 20);
        
        this.points_label = new Label();
        this.points_label.set({
            text: "Points: ",
            text_align: "left",
            text_valign: 'middle',
            text_color: "white",
            text_size: 16
        });
        this.points_label.set_position(650, 20);
        
        this.add_child(this.level_label);
        this.add_child(this.level_points_label);
        this.add_child(this.points_label);
    };
    
    Hud.prototype.update = function() {
        this.points_label.set({
            text: "Points: " + this.points
        });
    };

    Hud.prototype.on_added_to_parent = function(parent) {
        Drawable.prototype.on_added_to_parent.call(this, parent);

    };

    Hud.prototype.on_remove_from_parent = function(parent) {
        Drawable.prototype.on_remove_from_parent.call(this, parent);

    };

    Hud.prototype.draw = function(context) {

    };

    Hud.prototype.clear = function(context) {

    };

    window.Hud = Hud;

}(window));