(function(window,undefined){
    
    function Alert(level_completed){
        this.initialize(level_completed);
    }    
    
    Alert.prototype = new Drawable();
    Alert.prototype.drawable_initialize = Alert.prototype.initialize;    
    Alert.prototype.initialize = function(level_completed){        
        this.drawable_initialize();
        
              
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
        
        
        this.cost_label = new Label();
        this.cost_label.set({
            text: "NEXT: "+ (level_completed + 1) ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
                
        this.cancel_button = new Button({image:ContentManager.images.blank_black});
        this.cancel_button.text = "cancel";
        this.cancel_button.text_color = "#ffffff";
        this.cancel_button.font_size = 11;
        this.cancel_button.on_mouse_up = Alert.prototype.on_cancel.bind(this);
        this.cancel_button.priority = 20;
        
        this.layout();
        
        this.add_child(this.cancel_button);
        this.add_child(this.title);
        this.add_child(this.cost_label);
       
        
        
        
    };
    
    Alert.prototype.layout = function(){
        
        var padding = 10;
        this.title.set_position(this.width/2 - this.title.width/2,40);

        this.cost_label.set_position(this.width/2 - this.cost_label.width/2,this.title.get_position().y + 40);
        this.cancel_button.set_position(this.width/2 - this.cancel_button.width/2,this.cost_label.get_position().y + 25);
    };
    
    
    Alert.prototype.on_cancel = function(event){
        event.stop_propagation();
        this.remove_from_parent();
    };
    
    Alert.prototype.on_mouse_down = function(event){
        event.stop_propagation();
    };
    
    Alert.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
        game.input.add(this);
        game.input.add(this.cancel_button);  
        
    };
    
    Alert.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
        game.input.remove(this);
        game.input.remove(this.cancel_button);
    };
    
    Alert.prototype.draw = function(context){
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
    
    Alert.prototype.clear = function(context){
        
    };
    
    window.Alert = Alert;
    
}(window));