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
            text_color: "#c4d742",
            text_font_name: 'Special Elite',
            text_size: 28
        });
        this.level_label.set_position(20, 30);
        
        this.level_points_label = new Label();
        this.level_points_label.set({
            text: "Level points: ",
            text_align: "left",
            text_valign: 'middle',
            text_color: "#c4d742",
            text_font_name: 'Special Elite',
            text_size: 28
        });
        this.level_points_label.set_position(170, 30);
        
        this.points_label = new Label();
        this.points_label.set({
            text: "Points: ",
            text_align: "left",
            text_valign: 'middle',
            text_color: "#c4d742",
            text_font_name: 'Special Elite',
            text_size: 28
        });
        this.points_label.set_position(600, 30);
        
        this.add_child(this.level_label);
        this.add_child(this.level_points_label);
        this.add_child(this.points_label);
    };
    
    Hud.prototype.update = function() {
        this.points_label.set({
            text: "Points: " + this.points
        });
        this.level_points_label.set({
            text: "Level points: " + this.level_points
        });
        this.level_label.set({
            text: "Level: " + this.level
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