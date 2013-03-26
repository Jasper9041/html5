/**
 * Create HERO character
 * extends sprite > character
 */

(function () {
    "use strict";
	var NULL = null,
		FALSE = false,
		TRUE = true,

		Hero = function (params) {
            Entity.call(this, params);
		};

    // extend chain: Sprite::Entity::Hero
    Hero.prototype = Entity.prototype;

    Hero.prototype.handleRemoteController = function (e) {
        console.log("handling Hero's controller");
        console.log(e);
    };

    Hero.prototype.collision = function (e) {
        console.log("collides");
        console.log(e);
    };
    window.Hero = Hero;
}());