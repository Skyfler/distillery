"use strict";

/**
 Smoothly scroll element to the given target (element.scrollTop)
 for the given duration

 Returns a promise that's fulfilled when done, or rejected if
 interrupted
 */

var _smoothScroll = {

	scrollTo: function(element, target, duration) {
		target = Math.round(target);
		duration = Math.round(duration);
		if (duration < 0) {
			return Promise.reject("bad duration");
		}
		if (duration === 0) {
			element.scrollTop = target;
			return Promise.resolve();
		}

		var start_time = Date.now();
		var end_time = start_time + duration;

		var start_top = element.scrollTop;
		var distance = target - start_top;

		// based on http://en.wikipedia.org/wiki/Smoothstep
		var smooth_step = function(start, end, point) {
			if(point <= start) { return 0; }
			if(point >= end) { return 1; }
			var x = (point - start) / (end - start); // interpolation
			return x*x*(3 - 2*x);
		};

		return new Promise(function(resolve, reject) {
			// This is to keep track of where the element's scrollTop is
			// supposed to be, based on what we're doing
			var previous_top = element.scrollTop;

			// This is like a think function from a game loop
			var scroll_frame = function() {

//                console.log('previous_top');
//                console.log(previous_top);
				if(element.scrollTop != previous_top) {
					reject("interrupted");
					return;
				}

				// set the scrollTop for this frame
				var now = Date.now();
				var point = smooth_step(start_time, end_time, now);
				var frameTop = Math.round(start_top + (distance * point));
//                var frameTop = start_top + (distance * point);
//                console.log('frameTop');
//                console.log(frameTop);
				element.scrollTop = frameTop;
//                console.log('element.scrollTop');
//                console.log(element.scrollTop);

				// check if we're done!
				if(now >= end_time) {
					resolve();
					return;
				}

				// If we were supposed to scroll but didn't, then we
				// probably hit the limit, so consider it done; not
				// interrupted.
				if(element.scrollTop === previous_top
					&& element.scrollTop !== frameTop) {
//                    console.log('resolve');
//                    resolve();
//                    return;
				}
				previous_top = element.scrollTop;

				// schedule next frame for execution
				setTimeout(scroll_frame, 0);
			};

			// boostrap the animation process
			setTimeout(scroll_frame, 0);
		});
	},

	getPageScrollElem: function() {
		var bodyScroll = document.body.scrollTop;
		document.body.scrollTop++;
		var pageScrollElem = document.body.scrollTop ? document.body : document.documentElement;
		document.body.scrollTop = bodyScroll;
		return pageScrollElem;
	},

	getCoords: function(elem) {
		// (1)
		var box = elem.getBoundingClientRect();

		var body = document.body;
		var docEl = document.documentElement;

		// (2)
		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

		// (3)
		var clientTop = docEl.clientTop || body.clientTop || 0;
		var clientLeft = docEl.clientLeft || body.clientLeft || 0;

		// (4)
		var top = box.top + scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;

		return {
			top: top,
			left: left
		}
	}

};

try {
	module.exports = _smoothScroll;
} catch (err) {
	console.warn(err);
}

