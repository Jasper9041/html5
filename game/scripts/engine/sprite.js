/* Sprite.js
 * sprites are objects with width, height, x, y and potential background images
*/
(function () {
    var index = 0;

    var Sprite = function (params) {
        
        if (!params) {params = {};}

        this.x = params.x || 0;
        this.y = params.y || 0;
        this.rotation = 0;
        this.collidesWith = params.collidesWith || [];
        this.sx = 0;
        this.sy = 0;
        this.index = index;
        this.width = params.width || 30;
        this.height = params.height || 30;
        this.image = params.image || null;
        this.color = params.color || "#000000";
        this.scaleX = 1; // 2 = half
        this.scaleY = 1; // 2 = half
        this.ready = false;
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
        // my bounds vs collidables
        console.log(this.collidesWith);
    };

    Sprite.prototype.scale = function (scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    };

    Sprite.prototype.render = function (context) {
        if (typeof this.image !== "string" && this.ready) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.rotation);
            context.scale(this.scaleX, this.scaleY);
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
            context.restore();
        }
    };

    window.Sprite = Sprite;
}());