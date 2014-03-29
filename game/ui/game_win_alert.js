(function(window,undefined){
    
    function GameWinAlert(level_completed){
        this.initialize(level_completed);
    }    
    
    GameWinAlert.prototype = new Drawable();
    GameWinAlert.prototype.drawable_initialize = GameWinAlert.prototype.initialize;    
    GameWinAlert.prototype.initialize = function(level_completed){        
        this.drawable_initialize();
        
        this.level = level_completed;
        this.points = 0;
        
        
        this.image = ContentManager.images.message_box.image;
        this.set_size(this.image.width,this.image.height);
        
        this.priority = 19;
        
        this.title = new Label();
        this.title.set({
            text: "Level Completed: "+ level_completed ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_font_name : 'Sofadi One',
            text_size : 22
        });
        
        
        this.next_level_label = new Label();
        this.next_level_label.set({
            text: "Next Level: "+ (level_completed + 1) ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_font_name : 'Sofadi One',
            text_size : 18
        });
        
        this.points_label = new Label();
        this.points_label.set({
            text: "Points: "+ this.points ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_font_name : 'Sofadi One',
            text_size : 15
        });
        
        
        this.press_space_label = new Label();
        this.press_space_label.set({
            text: "or , press SPACE" ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_font_name : 'Sofadi One',
            text_size : 15
        });
        
                
        this.next_button = new Button({image:ContentManager.images.button});
        this.next_button.text = "next";
        this.next_button.font_family = 'Sofadi One';
        this.next_button.text_color = "#ffffff";
        this.next_button.font_size = 18;
        this.next_button.on_mouse_up = GameWinAlert.prototype.on_restart.bind(this);
        this.next_button.priority = 20;
        
        this.layout();
        
        this.add_child(this.next_button);
        this.add_child(this.title);
        this.add_child(this.next_level_label);
        this.add_child(this.points_label);
        this.add_child(this.press_space_label);
       
        this.callback = function(){};
        
        this.z_index = 10;
        
        
    };
    
    GameWinAlert.prototype.layout = function(){
        
        var padding = 10;
        this.title.set_position(this.width/2 - this.title.width/2,85);

        this.next_level_label.set_position(this.width/2 - this.next_level_label.width/2,this.title.get_position().y + 30);
        
        this.points_label.set_position(this.width/2 - this.points_label.width/2,this.next_level_label.get_position().y + 30);
        
        this.next_button.set_position(this.width/2 - this.next_button.width/2,this.points_label.get_position().y + 20);
    
        this.press_space_label.set_position(this.width/2 - this.press_space_label.width/2,this.next_button.get_position().y + 50);
        
    };
    
    
    GameWinAlert.prototype.on_restart = function(event){
        event.stop_propagation();
        this.remove_from_parent();
        this.callback();
    };
    
    GameWinAlert.prototype.on_mouse_down = function(event){
        event.stop_propagation();
    };
    
    GameWinAlert.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
        game.input.add(this);
        game.input.add(this.next_button);  
        
         this.title.set({text: "Level Completed: "+ this.level });
        
         this.next_level_label.set({text: "Next Level: "+ (this.level + 1) });
         
         this.points_label.set({text: "Points: "+ this.points });
        
    };
    
    GameWinAlert.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
        game.input.remove(this);
        game.input.remove(this.next_button);
    };
    
    GameWinAlert.prototype.draw = function(context){
        var position = this.bounds.pos;
       
        context.drawImage(this.image,position.x,position.y);
        
    };
    
    GameWinAlert.prototype.clear = function(context){
        
    };
    
    window.GameWinAlert = GameWinAlert;
    
}(window));