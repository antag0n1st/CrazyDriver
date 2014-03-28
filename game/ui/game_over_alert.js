(function(window,undefined){
    
    function GameOverAlert(level_completed){
        this.initialize(level_completed);
    }    
    
    GameOverAlert.prototype = new Drawable();
    GameOverAlert.prototype.drawable_initialize = GameOverAlert.prototype.initialize;    
    GameOverAlert.prototype.initialize = function(level_completed){        
        this.drawable_initialize();
        
              
        this.set_size(250,150);
        
        this.points=0;
        this.level=0;
        
        this.priority = 19;
        
        this.title = new Label();
        this.title.set({
            text: "Game Over" ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
        this.level_label = new Label();
        this.level_label.set({
            text: "Level: " + this.level ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
        this.points_label = new Label();
        this.points_label.set({
            text: "Points: "+ this.points ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
                
        this.cancel_button = new Button({image:ContentManager.images.blank_black});
        this.cancel_button.text = "Reload";
        this.cancel_button.text_color = "#ffffff";
        this.cancel_button.font_size = 11;
        this.cancel_button.on_mouse_up = GameOverAlert.prototype.on_restart.bind(this);
        this.cancel_button.priority = 20;
        
        this.layout();
        
        this.add_child(this.cancel_button);
        this.add_child(this.title);
        this.add_child(this.level_label);
        this.add_child(this.points_label);
       
        this.callback = function(){};
        
        this.z_index = 10;
        
        
    };
    
    GameOverAlert.prototype.layout = function(){
        
        var padding = 10;
        this.title.set_position(this.width/2 - this.title.width/2,30);

        this.level_label.set_position(this.width/2 - this.level_label.width/2,this.title.get_position().y + 30);
        this.points_label.set_position(this.width/2 - this.points_label.width/2,this.level_label.get_position().y + 30);
        this.cancel_button.set_position(this.width/2 - this.cancel_button.width/2,this.points_label.get_position().y + 25);
    };
    
    
    GameOverAlert.prototype.on_restart = function(event){
        event.stop_propagation();
        this.remove_from_parent();
        this.callback();
    };
    
    GameOverAlert.prototype.on_mouse_down = function(event){
        event.stop_propagation();
    };
    
    GameOverAlert.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
        game.input.add(this);
        game.input.add(this.cancel_button);  
        
         this.level_label.set({text: "Level: "+ (this.level) });
         
         this.points_label.set({text: "Points: "+ this.points });
        
    };
    
    GameOverAlert.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
        game.input.remove(this);
        game.input.remove(this.cancel_button);
    };
    
    GameOverAlert.prototype.draw = function(context){
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
    
    GameOverAlert.prototype.clear = function(context){
        
    };
    
    window.GameOverAlert = GameOverAlert;
    
}(window));