(function(window,undefined){
    
    function BuyAlert(unit,property){
        this.initialize(unit,property);
    }    
    
    BuyAlert.prototype = new Drawable();
    BuyAlert.prototype.drawable_initialize = BuyAlert.prototype.initialize;    
    BuyAlert.prototype.initialize = function(unit,property){        
        this.drawable_initialize();
        
        this.unit = unit;
        this.property = property;
        
        this.next = UnitsManager.get_next(unit,property);
        
        this.set_size({width:250,height:150});
        
        this.priority = 19;
        
        this.title = new Label();
        this.title.set({
            text: "Upgrade to: "+ Math.round(this.next.next) ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
        
        this.cost_label = new Label();
        this.cost_label.set({
            text: "cost: "+ Math.round(this.next.price) ,
            text_align : "left",
            text_valign: 'middle',
            text_color : "black",
            text_size : 16
        });
        
        this.coins = new ImageView(ContentManager.images.coins);
        
        
        this.buy_button = new Button({image:ContentManager.images.blank_black});
        this.buy_button.text = "buy";
        this.buy_button.text_color = "#ffffff";
        this.buy_button.font_size = 11;
        this.buy_button.on_mouse_up = BuyAlert.prototype.on_buy.bind(this);
        this.buy_button.priority = 20;
        
        this.cancel_button = new Button({image:ContentManager.images.blank_black});
        this.cancel_button.text = "cancel";
        this.cancel_button.text_color = "#ffffff";
        this.cancel_button.font_size = 11;
        this.cancel_button.on_mouse_up = BuyAlert.prototype.on_cancel.bind(this);
        this.cancel_button.priority = 20;
        
        this.layout();
        
        this.add_child(this.buy_button);
        this.add_child(this.cancel_button);
        this.add_child(this.title);
        this.add_child(this.cost_label);
        this.add_child(this.coins);
        
        
        
    };
    
    BuyAlert.prototype.layout = function(){
        
        var padding = 10;
        this.title.set_center({x:this.width/2,y:40});
        
        this.coins.set_center({x:this.width - this.coins.width - padding*2,y: 75});
        this.cost_label.set_center({x:this.coins.get_left() - this.cost_label.width/2 - padding,y:85});
        this.cancel_button.set_position({x:this.width/2 + padding,y:this.height-this.cancel_button.height - padding});
        this.buy_button.set_position({x:this.width/2 - this.buy_button.width - padding,y:this.height-this.cancel_button.height - padding});
    };
    
    BuyAlert.prototype.on_buy = function(event){
        event.stop_propagation();
        
        if( Math.round(this.next.price) > UnitsManager.coins){
            console.log("not enough coins");
        }else{
            UnitsManager.coins -= Math.round(this.next.price);
            UnitsManager.upgrade(this.unit,this.property);
        }    
        
        var parent = this.get_parent();
        parent.coins_label.set({text: UnitsManager.coins});
        
        parent.set_new_container(this.unit);
        
        this.remove_from_parent();
    };
    
    BuyAlert.prototype.on_cancel = function(event){
        event.stop_propagation();
        this.remove_from_parent();
    };
    
    BuyAlert.prototype.on_mouse_down = function(event){
        event.stop_propagation();
    };
    
    BuyAlert.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
        game.input.add(this);
        game.input.add(this.buy_button);
        game.input.add(this.cancel_button);  
        
    };
    
    BuyAlert.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
        game.input.remove(this);
        game.input.remove(this.buy_button);
        game.input.remove(this.cancel_button);
    };
    
    BuyAlert.prototype.draw = function(context){
        var position = this.bounds.get_position();
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
    
    BuyAlert.prototype.clear = function(context){
        
    };
    
    window.BuyAlert = BuyAlert;
    
}(window));