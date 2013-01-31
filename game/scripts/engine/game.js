/* Game.js */

var Game = function (config) {
    var self = this;
    self.displayList = new DisplayList();
    self.config = {
        width: 600,
        height: 400
    };
    self.ui = {
        canvas: null,
        context: null,
        buffer: null,
        buffer_context: null
    };
    self.autorender = true;
    return self;
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
    
    wrapper.appendChild(this.ui.canvas);
    wrapper.appendChild(this.ui.buffer);
    main.appendChild(wrapper);

};

Game.prototype.handleKeypress = function (key, cb) {
    var keyMap = {
        39: "right",
        40: "down",
        37: "left",
        38: "up"
    }, key = keyMap[key];
    if (cb) {
        cb.apply(null, [key]);
    }
};

Game.prototype.render = function () {
    if (this.autorender) {
        window.requestAnimationFrame(this.render.bind(this), this.ui.canvas);
    }
    this.ui.context.clearRect(0,0,this.ui.canvas.width, this.ui.canvas.height);
    var i = 0,
        length = this.displayList.items.length,
        item;
    for (; i < length; i++) {
        item = this.displayList.items[i];
        item.render(this.ui.context);
    }
};