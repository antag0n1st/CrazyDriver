(function(window,undefined){
    
    function GameWinAlert(level_completed){
        this.initialize(level_completed);
    }    
    
    GameWinAlert.prototype = new Drawable();
    GameWinAlert.prototype.drawable_initialize = GameWinAlert.prototype.initialize;    
    GameWinAlert.prototype.initialize = function(level_completed){        
        this.drawable_initialize();
        
        this.level = level_completed;
        this.set_size(250,150);
        
        this.priority = 19;
        
        this.title = new Label();
        this.title.set({
            text: "Level Completed: "+ level_completed ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
        
        this.next_level_label = new Label();
        this.next_level_label.set({
            text: "NEXT: "+ (level_completed + 1) ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
                
        this.next_button = new Button({image:ContentManager.images.blank_black});
        this.next_button.text = "next";
        this.next_button.text_color = "#ffffff";
        this.next_button.font_size = 11;
        this.next_button.on_mouse_up = GameWinAlert.prototype.on_restart.bind(this);
        this.next_button.priority = 20;
        
        this.layout();
        
        this.add_child(this.next_button);
        this.add_child(this.title);
        this.add_child(this.next_level_label);
       
        this.callback = function(){};
        
        this.z_index = 10;
        
        
    };
    
    GameWinAlert.prototype.layout = function(){
        
        var padding = 10;
        this.title.set_position(this.width/2 - this.title.width/2,40);

        this.next_level_label.set_position(this.width/2 - this.next_level_label.width/2,this.title.get_position().y + 40);
        this.next_button.set_position(this.width/2 - this.next_button.width/2,this.next_level_label.get_position().y + 25);
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
        
         this.next_level_label.set({text: "NEXT: "+ (this.level + 1) });
        
    };
    
    GameWinAlert.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
        game.input.remove(this);
        game.input.remove(this.next_button);
    };
    
    GameWinAlert.prototype.draw = function(context){
        var position = this.bounds.pos.clone();
        context.save();
        context.beginPath();
        
        context.strokeStyle = "yellow";
        context.fillStyle = "white";
        
        context.rect(position.x,position.y,this.width,this.height);
        context.stroke();
        context.fill();
        
        context.closePath();
        context.restore();
        
    };
    
    GameWinAlert.prototype.clear = function(context){
        
    };
    
    window.GameWinAlert = GameWinAlert;
    
}(window));