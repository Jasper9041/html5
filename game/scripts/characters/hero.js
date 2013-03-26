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
        //console.log("handling Hero's controller");

        if (e.activeButtons['13']) {
            this.y += this.speed;
        }
        if (e.activeButtons['15']) {
            this.x += this.speed;
        }
        if (e.activeButtons['14']) {
            this.x -= this.speed;
        }
        if (e.activeButtons['12']) {
            this.y -= this.speed;
        }
    };

    Hero.prototype.collision = function (e) {
        console.log("collides");
        console.log(e);
    };
    window.Hero = Hero;
}());