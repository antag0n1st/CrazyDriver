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

        ContentManager.download_images(this.stage, function() {            
            window.game.start();
        });

        window.game = this;
    };




    Game.prototype.start = function() {

        this.navigator.add(new GameScreen());
        
        // we want to do some work before we update the canvas,
        // otherwise we could use Ticker.addListener(stage);
        Ticker.add_listener(this);
        // Targeting 30 FPS
        Ticker.set_fps(30);
        Ticker.start();
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