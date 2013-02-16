/* Game.js */
//require(["engine/display_list"], function () {
    var Game = function (config) {
        if (!config) { config = {};}
        var self = this;
        self.background = new DisplayList();
        self.displayList = new DisplayList();
        
        // viewport
        self.config = {
            width: config.width || 600,
            height: config.height || 400
        };
        
        // canvas engine
        self.ui = {
            canvas: null,
            context: null,
            buffer: null,
            buffer_context: null,
            background: null,
            background_context: null
        };

        // world context, origin point, etc
        self.map = {
            type: "world",
            origin: [0,0],
            bounds: null, // bounds are origin point, width x height rectangle at tile size offset
            tile_size: config.tile_size || [16,16] // sets up a 16x16 tile size for viewport
        };

        // autorender the canvas
        self.autorender = config.autorender || true;

        return self;
    };

    Game.prototype = {
        listeners: [], // array of listeners
        listener_map: {},
        observers: [], // array of elements listening for actions
        observer_map: {},
        tiles: {}
    };

    /**
     * Catch all event handler
     * 
     * @method handleEvent
     */
    Game.prototype.handleEvent = function (event) {
        var i,l, item;
        if (this.observer_map.hasOwnProperty(event.type)) {
            //console.log(this.observer_map[event.type]);
            l = this.observer_map[event.type].length;
            for (i = 0; i < l; i++) {
                item = this.observer_map[event.type][i];
                // item.context
                // item.trigger
                if (item.context && item.trigger) {
                    /*
                    console.log(item.context);
                    console.log(item.trigger);
                    console.log(item.context[item.trigger]);
                    */
                    item.context[item.trigger].apply(item.context, [event]);
                }
            }
        }
    };

    /**
     * Add event listeners that can trigger events to observers
     *
     * @method addListener
     */
    Game.prototype.addListener = function (target, type) {
        var length;
        if (!this.listener_map.hasOwnProperty(type)) {
            this.listeners.push(target.addEventListener(type, this.handleEvent.bind(this), false));
            // store the index in the listeners array
            length = this.listeners.length-1;
            this.listener_map[type] = length; // not target-type
            return true;
        }
        return false;
    };

    /**
     * Adds an Observer to the game list
     * @note One can add observers prior to initializing actual event listening
     *
     * @method addObserver
     */
    Game.prototype.addObserver = function (observer, type, trigger) {
        var length, i;
        if (!this.observer_map.hasOwnProperty(type)) {
            this.observer_map[type] = []; // great a new Array to hold these goodies
        }
        length = this.observer_map[type].length;
        for (i = 0; i < length; i++) {
            if (this.observer_map[type][i].context === observer) {
                return false;
            }
        }
        this.observer_map[type].push({
            context: observer,
            trigger: trigger
        });
        return true;
    };

    Game.prototype.init = function () {
        var main = document.getElementById("body"),
            wrapper = document.createElement('div');
        
        wrapper.classList.add("fluid");
    
        this.ui.canvas = document.createElement("canvas");
        this.ui.canvas.classList.add("game");
        this.ui.canvas.width = this.config.width;
        this.ui.canvas.height = this.config.height;
        this.ui.context = this.ui.canvas.getContext('2d');
    
        this.ui.buffer = document.createElement("canvas");
        this.ui.buffer.classList.add("hidden");
        this.ui.buffer.width = this.config.width;
        this.ui.buffer.height = this.config.height;
        this.ui.buffer_context = this.ui.buffer.getContext('2d');

        this.ui.background = document.createElement("canvas");
        this.ui.background.classList.add("hidden");
        this.ui.background.width = this.config.width;
        this.ui.background.height = this.config.height;
        this.ui.background_context = this.ui.background.getContext('2d');
        
        wrapper.appendChild(this.ui.canvas);
        wrapper.appendChild(this.ui.buffer);
        wrapper.appendChild(this.ui.background);
        main.appendChild(wrapper);
    
    };

    /*
    self.map = {
            type: "world",
            origin: [0,0],
            bounds: null, // bounds are origin point, width x height rectangle at tile size offset
            tile_size: config.tile_size || [16,16] // sets up a 16x16 tile size for viewport
        };
    */
    Game.prototype.setup = function () {
        this.tiles.map = [];
    };

    Game.prototype.handleKeypress = function (key, cb) {
        var keyMap = {
            39: "right",
            40: "down",
            37: "left",
            38: "up"
        }, key = keyMap[key];
        if (cb) {cb.apply(null, [key]);}
    };

    Game.prototype.renderLayer = function (list, buffer, buffer_context) {
        if (!list || !buffer || !buffer_context) { return; }
        var i, length, item;
        // clear the buffer
        buffer_context.clearRect(0,0,this.ui.canvas.width, this.ui.canvas.height);
        length = list.items.length;
        
        for (i = 0; i < length; i++) {
            item = list.items[i];
            item.render(buffer_context);
        }

    };

    Game.prototype.renderBackground = function () {
        this.renderLayer(this.background, this.ui.background, this.ui.background_context);
    };

    Game.prototype.render = function () {
        if (this.autorender) {
            window.requestAnimationFrame(this.render.bind(this), this.ui.canvas);
        }
        /*
        this.ui.buffer_context.clearRect(0,0,this.ui.canvas.width, this.ui.canvas.height);
        var i = 0,
            length = this.displayList.items.length,
            item;
        for (; i < length; i++) {
            item = this.displayList.items[i];
            item.render(this.ui.buffer_context);
        }
        this.ui.context.clearRect(0,0,this.ui.canvas.width, this.ui.canvas.height);
        this.ui.context.drawImage(this.ui.buffer, 0, 0);
        */
        this.renderLayer(this.displayList, this.ui.buffer, this.ui.buffer_context);
        this.ui.context.clearRect(0,0,this.ui.canvas.width, this.ui.canvas.height);
        this.ui.context.drawImage(this.ui.background, 0, 0);
        this.ui.context.save();
        this.ui.context.drawImage(this.ui.buffer, 0, 0);
        this.ui.context.restore();
    };

    window.Game = Game;
//});