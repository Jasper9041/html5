/* Character.js
 * Used to spawn characters that do neat things
 * @extends sprite.js
 */

(function() {
	var Character = function (params) {
		console.log(params.collidesWith);
		var self = this;
		self.speed = 4;
		self.direction = 0;
		// character needs collisions list
		Sprite.call(this, params);
		return self;
	},
	LEFT = 37,
	UP = 38,
	RIGHT = 39,
	DOWN = 40;

	Character.prototype = Sprite.prototype;

	Character.prototype.state = {
		current: "idle",
		default: "idle",
		walking: {
			sequence: 9,
			current: 0,
			padding: 4,
			delay: 1,
			left_offset: 0,
			right_offset: 636,
			map: {
				0: 0, // offset x for sprite sheet
				1: 72,
				2: 142,
				3: 212,
				4: 286,
				5: 356,
				6: 424,
				7: 494,
				8: 564
			}
		},
		idle: {},
		attacking: {},
		dying: {},
		keys: {
			left: 0,
			right: 0,
			up: 0,
			down: 0
		}
	};

	// this.state.keys
	// 0,1, 2, 3
	Character.prototype.handleWalk = function () {

		this.handleMovement();
		
		// character has a sprite map of walking states
		// update these every tick
		if ((this.state.walking.current+1) < this.state.walking.sequence) {
			this.state.walking.current += 1;
		} else {
			this.state.walking.current = 0;
		}

		if (this.state.walking.map[this.state.walking.current]) {
			this.sx = Math.floor(this.state.walking.offset + this.state.walking.map[this.state.walking.current]);
		} else {
			this.sx = Math.floor(this.state.walking.offset + (this.state.walking.current * (this.width + this.state.walking.padding)));
		}
	};

	/**
	 * Handles Basic Character Movement based off of a state map
	 * give an object a state and it moves
	*/
	Character.prototype.handleMovement = function () {
		// direction (up,right,down,left = 0,1,2,3)
		if (this.state.keys.up) {
			this.y -= this.speed;
			this.state.walking.offset = this.state.walking.right_offset;
			this.sy = 100;
		}
		if (this.state.keys.down) {
			this.y += this.speed;
			this.state.walking.offset = this.state.walking.left_offset;
			this.sy = 100;
		}
		if (this.state.keys.right) {
			this.x += this.speed;
			this.sy = 0;
			this.state.walking.offset = this.state.walking.right_offset;
		}
		if (this.state.keys.left) {
			this.x -= this.speed;
			this.sy = 0;
			this.state.walking.offset = this.state.walking.left_offset;
		}
	};

	Character.prototype.resetAnimation = function () {
		
		this.state[this.state.current].current = 0;
		if (this.state.keys.right) {
			this.sx = this.state.walking.right_offset;
		} else {
			this.sx = 0;
		}
		if (this.state.keys.up) {
			this.sy = 100;
			this.sx = this.state.walking.right_offset;
		}
		this.state.current = this.state.default;
	};

	Character.prototype.handleComplete = function (e) {
		switch (e.type) {
			case "keyup":
				this.resetAnimation();
				this.handleKeyUp(e);
				break;
		}
	};

	Character.prototype.handleKeyUp = function (e) {
		switch (e.keyCode) {
		case RIGHT:
			this.state.keys.right = 0;
			break;
		case LEFT:
			this.state.keys.left = 0;
			break;
		case DOWN:
			this.state.keys.down = 0;
			break;
		case UP:
			this.state.keys.up = 0;
			break;
		}
	};

	Character.prototype.handleKeypress = function (e) {
		switch(e.keyCode) {
			case RIGHT:
				this.state.keys.right = 1;
				this.handleWalk();
				this.checkCollisions();
				break;
			
			case DOWN:
				this.state.keys.down = 1;
				this.handleWalk();
				this.checkCollisions();
				break;
			
			case LEFT:
				this.state.keys.left = 1;
				this.handleWalk();
				this.checkCollisions();
				break;
			
			case UP:
				this.state.keys.up = 1;
				this.handleWalk();
				this.checkCollisions();
				break;
			
			case 65:
				console.log("attack"); // attack
				break;
			
			case 83:
				console.log("shield"); // sheild
				break;
		}
	};

	window.Character = Character;
}());