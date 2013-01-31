/* Sprite.js
 * sprites are objects with width, height, x, y and potential background images
*/
(function () {
    var index = 0;

    var Sprite = function (params) {
        
        if (!params) {params = {};}
    
        
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.index = index;
        this.width = params.width || 30;
        this.height = params.height || 30;
        this.image = params.image || null;
        this.color = params.color || "#000000";
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
                if (cb) {
                    cb.apply(null, [image]);
                }
            }
        }
    }

    Sprite.prototype.render = function (context) {
        if (typeof this.image !== "string") {
            context.drawImage(this.image, this.x, this.y);
        }
    };

    this.Sprite = Sprite;
}());