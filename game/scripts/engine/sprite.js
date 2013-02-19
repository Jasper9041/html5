/* Sprite.js
 * sprites are objects with width, height, x, y and potential background images
*/
(function () {
    "use strict";
    var index = 0, Sprite;
    Sprite = function (params) {
        if (!params) { params = {}; }
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.rotation = 0;
        this.collidesWith = params.collidesWith || [];
        this.sx = 0;
        this.sy = 0;
        this.collidable = params.collidable || false;
        this.index = index;
        this.width = params.width || 30;
        this.height = params.height || 30;
        this.image = params.image || null;
        this.color = params.color || "#000000";
        this.scaleX = 1; // 2 = half
        this.scaleY = 1; // 2 = half
        this.ready = false;
        this.showBounds = params.showBounds || false;
        this.boundsColor = params.boundsColor || "red";
        this.init();
        index += 1;
        return this;
    };

    Sprite.prototype.init = function (cb) {
        var image, self = this;
        if (this.image) {
            image = new Image();
            image.src = this.image;
            image.onload = function () {
                self.image = image;
                self.ready = true;
                if (cb) {
                    cb.apply(null, [image]);
                }
            }
        }
    };

    Sprite.prototype.checkCollisions = function () {
        var i = 0, length, item, collides;

        length = this.collidesWith.items.length;
        for (; i < length; i++) {
            item = this.collidesWith.items[i];
            
            // my bounds vs collidables
            if (this.index !== item.index && item.collidable) {
                collides = this.hitTest(this, item);
                if (collides.hit) {
                    console.log(collides);
                }
            }
        }
    };

    Sprite.prototype.getBounds = function () {
        var bounds = {};
        bounds.x = this.x - this.width / 2;
        bounds.y = this.y + this.height / 2;
        bounds.width = this.width;
        bounds.height = this.height;
        return bounds;
    };

    /**
     * Hit Test tests to see if the rect bounds of sA collide with sB
     *
     * @method hitTest
     */

    Sprite.prototype.hitTest = function (rectA, rectB, type) {
        var collides = { hit: false, where: null },
            tA = false, tB = false, tC = false, tD = false, tE = false;


        tA = (rectA.x + rectA.width) >= rectB.x;
        tB = (rectB.x + rectB.width) >= rectA.x; // left
        tE = (rectB.x + rectB.width) <= rectA.x; // right
        tC = (rectA.y + rectA.height) <= rectB.y;
        tD = (rectB.y + rectB.height) <= rectA.y;

        if (tA && tB && !tC && tD) {
            //console.log("rectA collides below rectB");
            collides.where = "below";
        } else if (tA && tB && !tE && !tC && !tD) {
            //console.log("rectA collides right of rectB");
            collides.where = "right";
        } else if (tA && tB && tE && !tC && !tD) {
            //console.log("rectA collides left of rectB");
            collides.where = "left";
        } else if (tA && tB && tC && !tD) {
            //console.log("rectA collides above rectB");
            collides.where = "above";
        }

        collides.hit = !(rectA.x + rectA.width <= rectB.x ||
           rectB.x + rectB.width < rectA.x ||
           rectA.y + rectA.height <= rectB.y ||
           rectB.y + rectB.height < rectA.y);

        return collides;
    };

    Sprite.prototype.scale = function (scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    };

    Sprite.prototype.render = function (context) {
        if (typeof this.image !== "string" && this.ready) {
            context.save();
            /*context.translate(this.x, this.y);
            context.rotate(this.rotation);
            context.scale(this.scaleX, this.scaleY);*/
            context.drawImage(
                this.image, 
                this.sx,
                this.sy, 
                this.width, 
                this.height, 
                this.x, 
                this.y, 
                this.width, 
                this.height
            );
            if (this.showBounds) {
                context.beginPath();
                context.rect(this.x, this.y, this.width, this.height);
                context.lineWidth = 1;
                context.strokeStyle = this.boundsColor;
                context.stroke();
            }
            context.restore();
        }
    };

    window.Sprite = Sprite;
}());