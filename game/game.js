//(function(window) {

    function Game() {
        this.initialize();
    }


    Game.prototype.initialize = function() {

        this.stage = new Stage('stage');
        this.input = new Input();
        
        if(!Config.is_mobile){            
            this.input.add_listener('stage');
        }
        

        this.paused = false;
        this.pause_callback = function() {
        };
        this.music = null;
        this.click = false;
        this.navigator = new Navigator();
   
        
        ContentManager.add_image('blank_black', 'assets/images/blank_black.png');
        ContentManager.add_image('blank_black_highlighted', 'assets/images/blank_black_highlighted.png');
        ContentManager.add_image('smoke', 'assets/images/smoke.png');
        
        ContentManager.add_image('car_animation', 'assets/images/car_animation.png');
        ContentManager.add_image('player', 'assets/images/player.png');
        ContentManager.add_image('parking', 'assets/images/parking.png');
        ContentManager.add_image('car', 'assets/images/car.png');
        ContentManager.add_image('bonus', 'assets/images/clock.png');
        ContentManager.add_image('message_box', 'assets/images/message_box.png');
        
        ContentManager.add_image('button', 'assets/images/button.png');
        ContentManager.add_image('button_highlighted', 'assets/images/button_highlighted.png');
        ContentManager.add_image('pointer', 'assets/images/pointer.png');
        ContentManager.add_image('points', 'assets/images/points.png');
        ContentManager.add_image('return_the_cart', 'assets/images/return_the_cart.png');
        
        ContentManager.add_sound('footsteps', 'assets/sounds/footsteps.mp3');
        ContentManager.add_sound('collect', 'assets/sounds/collect.mp3');
        ContentManager.add_sound('win', 'assets/sounds/win.mp3');
        ContentManager.add_sound('appear', 'assets/sounds/appear.wav');
        ContentManager.add_sound('car', 'assets/sounds/car.mp3');
        ContentManager.add_sound('crash', 'assets/sounds/crash.mp3');

        

        ContentManager.download_resources(this.stage, function() {            
            window.game.start();
        });

        window.game = this;
        this.navigator.add(new LoadingScreen());
        
        Ticker.add_listener(this);
        // Targeting 30 FPS
        Ticker.set_fps(30);
        Ticker.start();
    };




    Game.prototype.start = function() {

        this.navigator.remove_all();
        
        this.navigator.add(new HomeScreen());
        
        
        // we want to do some work before we update the canvas,
        // otherwise we could use Ticker.addListener(stage);
        
    };


    /**
     * It pauses the game , and call back should display other stage
     * @param {type} callback
     * @returns {undefined}
     */
    Game.prototype.pause = function(callback) {

        this.paused = true;
        this.pause_callback = callback || function() {
        };

    };


    Game.prototype.tick = function() {

        this.stage.clear_canvas();

        this.navigator.update();
        Actions.run();

        // check if the game is paused
        if (this.paused) {
            Ticker.stop();
            this.paused = !this.paused;
            this.pause_callback();
        }


        if (window.Config.debug) {
            this.stage.debug_grid();
        }
        
        this.stage.draw();
        
    };

//    window.Game = Game;
//
//}(window));