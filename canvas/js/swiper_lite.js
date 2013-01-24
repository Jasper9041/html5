YUI.add("swiper", function (Y) {

    var SwiperLiteService;
    /**
     * Handles touch or mouse events for swipes, tracks tap / swipe, and hardware accelerates pagination
     * @class SwiperService
     */

    SwiperLiteService = function (target, config) {
        Y.log("setup()", "debug", "SwiperService");
        var self = this;

        /*
         override swipe axis
         override acceptable_opposite_axis_movement
         override min_swipe_distance
        */

        // merge any overrides with defaults
        Y.merge(self.config, config);

        if (!target) {
            throw new Error("swiper lite requires a DOM Node to listen to events");
        } else {
            if (target.hasOwnProperty("_yuid")) {
                Y.log("converted YUI Node to DOMNode", "debug", "SwiperService");
                target = Y.Node.getDOMNode(target);
            }
            self.target = target;
        }
        

        return self;
    };

    SwiperLiteService.prototype = {
        config: {
            swipe: {
                axis: 'x',
                acceptable_opposite_axis_movement: 100,
                min_swipe_dist: 30
            },
            should_prevent_default_after: 10,
            listeners: {
                complete: null,
                init: null,
                slide: null,
                swipe: null,
                tap: null
            }
        },
        target: null,
        startX: 0,
        startY: 0,
        x: null,
        y: null,
        delta: {
            x: 0,
            y: 0,
            absx: 0,
            absy: 0
        },
        movement: {
            x: 0,
            y: 0
        },
        /*
         * General Event Dispatcher
         *
         * @method dispatch
         */
        dispatch: function (target, type, params) {
            //Y.log("dispatch()", "debug", "SwiperService");
            var evt;
            if (!params) { params = {};}
            evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(type, true, true, params);
            target.dispatchEvent(evt);
        },
        /**
         * Get the x and y positions of the touch event
         * 
         * @method getXY
         */
        getXY: function (touch) {
            var t = {x:0,y:0};

            if (touch.pageX || touch.pageY) {
                t.x = touch.pageX;
                t.y = touch.pageY;
            } else {
                t.x = touch.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                t.y = touch.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            t.x -= this.target.offsetLeft;
            t.y -= this.target.offsetTop;

            return t;
        },

        /**
         * Invalidate the swipe action if the opposite axis is greater than the target axis (deltas)
         *
         * @method invalidate_swipe
         */
        invalidate_swipe: function (axis, absx, absy) {
            if (!axis) { axis = this.axis;}
            if (!absx) { absx = this.delta.absx;}
            if (!absy) { absy = this.delta.absy;}

            if (axis === 'x') {
                if (absy < this.config.swipe.acceptable_opposite_axis_movement) {
                    return false;
                }
            } else {
                if (absx < this.config.swipe.acceptable_opposite_axis_movement) {
                    return false;
                }
            }
            return true;
        },
        /**
         * Was this transaction a tap?
         *
         * @method isTap
         */
        isTapOrSwipe: function (e) {
            var params,
                dispatch = false;

            if (!this.x || !this.y) {
                this.dispatch(this.target, "tap", {
                    x: this.startX,
                    y: this.startY
                });
                return;
            } else {
                params = {
                    x: this.x,
                    y: this.y,
                    delta: this.delta,
                    movement: this.movement,
                    direction: '',
                    axis: null
                };
                if (this.delta.absx > this.config.swipe.min_swipe_dist && this.delta.absy < this.delta.absx) {
                    // swipe event on x axis
                    params.direction = (this.delta.x > 0) ? 'left' : 'right';
                    params.axis = 'x';
                    if (!this.invalidate_swipe('x')) {
                        dispatch = true;
                    }
                } else if (this.delta.absy > this.config.swipe.min_swipe_dist && this.delta.absy > this.delta.absx) {
                    params.direction = (this.delta.y > 0) ? 'up' : 'down';
                    params.axis = 'y';
                    if (!this.invalidate_swipe('y')) {
                        dispatch = true;
                    }
                }

                if (dispatch) {
                    this.dispatch(this.target, "swipe", params);
                }
            }
        },
        /**
         * Test to see if we should stop default propogation of this event
         *
         * @method shouldPreventDefault
         * @param {Event} e Is the base touch event
         */
        shouldPreventDefault: function (e) {
            this.delta.absx = Math.abs(this.delta.x);
            this.delta.absy = Math.abs(this.delta.y);

            // if the movement along x or y axis is greater than should_prevent_default_after pixel distance
            // then prevent default
            if (this.delta.absx > this.config.should_prevent_default_after || this.delta.absy > this.config.should_prevent_default_after) {
                //Y.log("is preventing default", "debug", "SwiperService");
                e.preventDefault();
            }
        },
        /**
         * capture touch events
         *
         * @method captureTouch
         * @param {DOMNode} target Is the DOM Node you want to listen on
         */
        captureTouch: function (target) {
            if (!target) { target = this.target;}

            var self = this;

            // add touchStart listener
            target.addEventListener("touchstart", function (e) {
                var touch_event = event.touches[0],
                    pos;
                //Y.log(self.getXY(touch_event), "debug");
                pos = self.getXY(touch_event);
                self.startX = pos.x;
                self.startY = pos.y;
                // reset all values to zero
                self.delta.x = 0;
                self.delta.y = 0;
                self.movement.x = 0;
                self.movement.y = 0;
                self.dispatch(self.target, "action-start");
            }, false);

            target.addEventListener("touchmove", function (e) {
                var pos,
                    touch_event = e.touches[0];

                pos = self.getXY(touch_event);

                self.x = pos.x;
                self.y = pos.y;
                self.movement.x += self.x;
                self.movement.y += self.y;
                self.delta.x = self.startX - self.x;
                self.delta.y = self.startY - self.y;

                self.shouldPreventDefault(e);

                self.dispatch(self.target, "slide", {
                    delta: self.delta,
                    movement: self.movement
                });
            }, false);

            target.addEventListener("touchend", function (e) {
                self.isTapOrSwipe(e);
                self.x = null;
                self.y = null;
            }, false);
        }
    };
    Y.SwiperLiteService = SwiperLiteService;
}, "0.0.1");