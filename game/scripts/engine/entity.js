(function() {

	var NULL = null,
		TRUE = true,
		FALSE = false,

		Entity = function (params) {
			var self = this;
			self.speed = params.speed || 4; // factor of 4 since it is divisible by 16 which is the default tile size
			self.direction = 0;
			Sprite.call(this, params);
			return self;
		};

	// inherit from Sprite
	Entity.prototype = new Sprite();

    // should be capable of having many states
    Entity.prototype.state = {
        current: "",
        states: {}
    };

    // entity should be able to be affected by its surrounding
    // eg: entity is in water, in mud (slow), on ice slick = fast, blocked at wall
    Entity.prototype.mutators = {
        speed: NULL,
        orientation: NULL
    };

    /**
     * Entity should be able to be controlled via 3rd party - eg. websocket, usb controller, via SimpleAI
     *
     * @method handleRemoteController
     */
    Entity.prototype.handleRemoteController = function (e) {
    };

    /**
     * Entity should be able to react to collisions - eg. the character, enemy etc was hit (now what?)
     *
     * @method respondToCollision
     */
    Entity.prototype.respondToCollision = function (e) {

    };

    /**
     * Entity should be able to be hit, bumped, etc by other entities
     *
     * @method collision
     * @param {Event} e Is the collision event (has properties hit, and with - with means you hit X object)
     */
    Entity.prototype.collision = function (e) {
    };

    /**
     * Entity should be able to clear out collision states
     *
     * @method clearCollisions
     */
    Entity.prototype.clearCollisions = function (e) {
    };

    window.Entity = Entity;
}());