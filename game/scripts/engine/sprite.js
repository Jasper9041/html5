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
        var collides = { 
            hit: false, 
            where: {
                above: 0,
                below: 0,
                left: 0,
                right: 0
            }
        },
        // rectA height
        rAH = (rectA.y + rectA.height),
        // rectB height
        rBH = (rectB.y + rectB.height),
        // rectA width
        rAW = (rectA.x + rectA.width),
        // rectB width
        rBW = (rectB.x + rectB.width);

        // sprite can collide left, right or above, below


        // for above to be true
        if (rAH <= rectB.y) { 
            collides.where.right = 1;
        // left works good
        } else if (rBH <= rectA.y) {
            collides.where.left = 1;
        }

        // above / below (working as expected)
        if (rAH > rBH) {
            collides.where.above = 1;
        } else if (rAH < rBH) {
            collides.where.below = 1;
        }

        // try adding fuzzy distance metric to see which top,bottom,left,right hits

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