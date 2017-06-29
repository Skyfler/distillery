"use strict";

try {
	var Helper = require('./helper');
	var Animation = require('./animation');
} catch (err) {
	console.warn(err);
}

function FirstSlideIntro(options) {
	options.name = options.name || 'FirstSlideIntro';
	Helper.call(this, options);

	this._elem = options.elem;
	this._intro1Elem = options.intro1Elem;
	this._intro2Elem1 = options.intro2Elem1;
	this._intro2Elem2 = options.intro2Elem2;
	this._increment = options.increment || 3;

	this._onMouseWheel = this._onMouseWheel.bind(this);
	this._onTouchStart = this._onTouchStart.bind(this);
	this._onTouchMove = this._onTouchMove.bind(this);
	this._onTouchEnd = this._onTouchEnd.bind(this);

	this._init();
}

FirstSlideIntro.prototype = Object.create(Helper.prototype);
FirstSlideIntro.prototype.constructor = FirstSlideIntro;

FirstSlideIntro.prototype._init = function() {
	this._sendCustomEvent(document, 'firstSlideIntro', {bubbles: true, detail: {preventPageSlideScrolling: true}});

	this._intro1Proggress = 0;
	this._intro2Proggress = 0;
	this._intro_1();
	this._intro_2();

	this._addListener(window, 'wheel', this._onMouseWheel);
	this._addListener(document, 'touchstart', this._onTouchStart);
};

FirstSlideIntro.prototype._onMouseWheel = function(e) {
	if (!e.deltaY || this._scrollInProcess) return;

	if (this._noPageScrollArea || this._firstSlideIntro) return;

	if (e.deltaY > 0) {
		this._playIntro(this._increment);

	} else if (e.deltaY < 0) {
		this._playIntro(-this._increment);

	}
};

FirstSlideIntro.prototype._onTouchStart = function(e) {
	this._startDrag(e);
};

FirstSlideIntro.prototype._onTouchMove = function(e) {
	this._onTouchMoveDrag(e);
};

FirstSlideIntro.prototype._onTouchEnd = function(e) {
	this._onTouchEndDrag(e);
};

FirstSlideIntro.prototype._startDrag = function(e) {
	this._removeListener(this._elem, 'touchstart', this._onTouchStart);

	var clientY = (e.clientY === undefined) ? e.changedTouches[0].clientY : e.clientY;
	this._prevCursorYPosition = clientY + (window.pageYOffset || document.documentElement.scrollTop);

	this._addListener(document, 'touchmove', this._onTouchMove);
	this._addListener(document, 'touchend', this._onTouchEnd);
};

FirstSlideIntro.prototype._onTouchMoveDrag = function(e) {
	var clientY = (e.clientY === undefined) ? e.changedTouches[0].clientY : e.clientY;
	var currentcursorYPosition = clientY + (window.pageYOffset || document.documentElement.scrollTop);
	var yPositionDeleta = currentcursorYPosition - this._prevCursorYPosition;

	this._playIntro(-yPositionDeleta * 0.25);

	this._prevCursorYPosition = currentcursorYPosition;
};

FirstSlideIntro.prototype._onTouchEndDrag = function(e) {
	this._removeListener(document, 'touchmove', this._onTouchMove);
	this._removeListener(document, 'touchend', this._onTouchEnd);

	this._addListener(document, 'touchstart', this._onTouchStart);
};

FirstSlideIntro.prototype._playIntro = function(increment) {
	if (increment > 0) {
		if (this._intro1Proggress < 100) {
			this._intro_1(increment);
		} else if (this._intro2Proggress < 100) {
			this._intro_2(increment);
		} else {
			this._introEnd();
		}

	} else if (increment < 0) {
		if (this._intro2Proggress > 0) {
			this._intro_2(increment);
		} else if (this._intro1Proggress > 0) {
			this._intro_1(increment);
		}

	}
};

FirstSlideIntro.prototype._intro_1 = function(increment) {
	if (increment) {
		this._intro1Proggress += increment;
	}

	if (this._intro1Proggress < 0) {
		this._intro1Proggress = 0;
	} else if (this._intro1Proggress > 100) {
		this._intro1Proggress = 100;
	}

	this._intro1Elem.style.opacity = this._intro1Proggress / 100;

	if (this._intro1Proggress === 100) {
		this._intro1Elem.style.display = 'none';
	} else {
		this._intro1Elem.style.display = 'block';
	}
};

FirstSlideIntro.prototype._intro_2 = function(increment) {
	if (increment) {
		this._intro2Proggress += increment;
	}

	if (this._intro2Proggress < 0) {
		this._intro2Proggress = 0;
	} else if (this._intro2Proggress > 100) {
		this._intro2Proggress = 100;
	}

	this._intro2Elem1.style.background = 'rgba(1, 0, 0, ' + (1 - 1 * (this._intro2Proggress / 100)) + ')';
	if (this._intro2Proggress === 100) {
		this._intro2Elem1.style.height = 0;
	} else {
		this._intro2Elem1.style.height = 100 + '%';
	}
	this._intro2Elem2.style.width = 400 - 300 * (this._intro2Proggress / 100) + 'px';
	this._intro2Elem2.style.top = (window.innerHeight - this._intro2Elem2.offsetHeight) / 2 - ((window.innerHeight - this._intro2Elem2.offsetHeight) / 2 - 16) * (this._intro2Proggress / 100) + 'px';
};

FirstSlideIntro.prototype._introEnd = function() {
	this._sendCustomEvent(document, 'firstSlideIntro', {bubbles: true, detail: {preventPageSlideScrolling: false}});

	this._removeListener(window, 'wheel', this._onMouseWheel);
};

try {
	module.exports = FirstSlideIntro;
} catch (err) {
	console.warn(err);
}
