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

    /**
     * Returns the boundries of the rectangle for this Sprite
     *
     * @method getBounds
     */
    Sprite.prototype.getBounds = function () {
        var bounds = {};
        bounds.midpoint = [this.x + this.width/2, this.y + this.height/2];
        bounds.top = [[this.x,this.y],[bounds.midpoint[0], this.y],[this.x + this.width, this.y]]
        bounds.mid = [[this.x, bounds.midpoint[1]],[bounds.midpoint[0], bounds.midpoint[1]],[this.x + this.width, bounds.midpoint[1]]];
        bounds.bottom = [[this.x, this.y + this.height],[bounds.midpoint[0], this.y + this.height],[this.x + this.width, this.y + this.height]];
        return bounds;
    };

    /** 
     * Experimental - Performance Wise this will have to be optimized
     *
     * @method hitTestNinePoint
     */
    Sprite.prototype.hitTestNinePoint = function (rectA, rectB) {
        var boundsA = rectA.getBounds(),
            boundsB = rectB.getBounds(),
            hitTop = false,
            hitMid = false,
            hitBottom = false,
            isLeft = false,
            isRight = false,
            i = 0,
            l = 3;

        console.log("9 point bounds of rectA");
        console.log(boundsA);
        console.log("9 point bounds of rectB");
        console.log(boundsB);

        // for boundsA.top, boundsB.top is a < b for all
        /*for (; i < l; i++) {
            console.log("rectA.top["+i+"]: " + boundsA.top[i]);
            console.log("rectB.top["+i+"]: " + boundsB.top[i]);
            console.log("rectA.mid["+i+"]: " + boundsA.mid[i]);
            console.log("rectB.mid["+i+"]: " + boundsB.mid[i]);
            console.log("rectA.bottom["+i+"]: " + boundsA.bottom[i]);
            console.log("rectB.bottom["+i+"]: " + boundsB.bottom[i]);
        }
        */

        // test hit left
        function hitIsRight() {
            var isRight = false,
                cPoints = [false,false,false];
            // test a.top[2] vs b.top[0]
            if (a.top[2][0] > b.top[0][0]) {
                cPoints[0] = true;
            }
            if (a.mid[2][0] > b.mid[0][0]) {
                cPoints[1] = true;
            }
            if (a.bottom[2[0]] > b.bottom[0][0]) {
                cPoints[2] = true;
            }

        }

        function hitIsLeft(){}
        function hitIsTop(){}
        function hitIsBottom(){}
        
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