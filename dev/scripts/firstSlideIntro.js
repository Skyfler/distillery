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
	this._logoElems = options.logoElems;
	this._introElem1 = options.introElem1;
	this._introElem2 = options.introElem2;
	this._introElem3 = options.introElem3;
	this._introElem4 = options.introElem4;
	this._introElem5 = options.introElem5;
	this._scrollIcon = options.scrollIcon;
	this._animationDuration = options.animationDuration || 2000;
	this._smallLogoUrls = options.smallLogoUrls;
	this._increment = options.increment || 3;

	this._onMouseWheel = this._onMouseWheel.bind(this);
	this._onTouchStart = this._onTouchStart.bind(this);
	this._onTouchMove = this._onTouchMove.bind(this);
	this._onTouchEnd = this._onTouchEnd.bind(this);
	this._onResize = this._onResize.bind(this);

	this._init();
}

FirstSlideIntro.prototype = Object.create(Helper.prototype);
FirstSlideIntro.prototype.constructor = FirstSlideIntro;

FirstSlideIntro.prototype._init = function() {
	this._sendCustomEvent(document, 'firstSlideIntro', {bubbles: true, detail: {preventPageSlideScrolling: true}});

	this._loadImages(this._smallLogoUrls);

	this._introProggress = 0;
	this._playIntro(0);

	this._animateOpacity(
		this._logoElems.concat(this._scrollIcon),
		function(){
//			console.log(this.NAME + ': callback');
			this._addListener(window, 'wheel', this._onMouseWheel);
			this._addListener(document, 'touchstart', this._onTouchStart);
		}.bind(this)
	);

	this._addListener(window, 'resize', this._onResize);
};

FirstSlideIntro.prototype._animateOpacity = function(elemsArr, callback) {
	if (elemsArr.length === 0) {
		callback();
		return;
	};

	var currentAnimatedElem = elemsArr[0];

	this._introAnimation = new Animation(
		function(timePassed) {
			var timeMuliplier = Animation.linear(this._animationDuration, timePassed);
			currentAnimatedElem.style.opacity = timeMuliplier;
		}.bind(this),
		this._animationDuration,
		function() {
			delete this._introAnimation;
			this._animateOpacity(elemsArr.slice(1), callback);
		}.bind(this)
	);
};

FirstSlideIntro.prototype._onMouseWheel = function(e) {
	if (!e.deltaY || this._scrollInProcess) return;

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
	this._removeListener(document, 'touchstart', this._onTouchStart);

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

FirstSlideIntro.prototype._onResize = function() {
	this._playIntro(0);
};

FirstSlideIntro.prototype._playIntro = function(increment) {
	if (increment > 0) {
		if (this._introProggress < 100) {
			this._intro_1(increment);
		}
//		else if (this._introProggress < 100) {
//			this._intro_2(increment);
//		}

	} else if (increment < 0) {
		if (this._introProggress > 0) {
			this._intro_1(increment);
		}
//		else if (this._intro1Proggress > 0) {
//			this._intro_1(increment);
//		}

	} else if (increment === 0) {
		this._intro_1(0);
//		this._intro_2(0);
	}
};

//FirstSlideIntro.prototype._intro_1 = function(increment) {
//	if (increment) {
//		this._intro1Proggress += increment;
//	}
//
//	if (this._intro1Proggress < 0) {
//		this._intro1Proggress = 0;
//	} else if (this._intro1Proggress > 100) {
//		this._intro1Proggress = 100;
//	}
//
//	this._intro1Elem.style.opacity = this._intro1Proggress / 100;
//
//	if (this._intro1Proggress === 100) {
//		this._intro1Elem.style.display = 'none';
//	} else {
//		this._intro1Elem.style.display = 'block';
//	}
//};

FirstSlideIntro.prototype._intro_1 = function(increment) {
	if (increment) {
		this._introProggress += increment;
	}

	if (this._introProggress < 0) {
		this._introProggress = 0;
	} else if (this._introProggress > 100) {
		this._introProggress = 100;
	}

//	if (this._introProggress > 0) {
//		if (['xs', 'sm'].indexOf(this._checkScreenWidth()) !== -1) {
//			this._logoElems[1].style.display = 'none';
//		} else {
//			this._logoElems[1].style.display = '';
//		}
//		this._logoElems[2].style.display = 'none';
//		this._logoElems[3].style.display = 'none';
//	} else {
//		this._logoElems[1].style.display = '';
//		this._logoElems[2].style.display = '';
//		this._logoElems[3].style.display = '';
//	}

	this._introElem5.style.height = this._calculateIntroElem5Height(this._introProggress) + 'px';

	this._introElem1.style.background = 'rgba(1, 0, 0, ' + (1 - this._introProggress / 100) + ')';
	if (this._introProggress === 100) {
		this._introElem1.style.height = 0;
		this._changeLogoUrls();
	} else {
		this._introElem1.style.height = 100 + '%';
	}
//	this._introElem2.style.width = window.innerWidth 400 - 290 * (this._introProggress / 100) + 'px';
	this._introElem2.style.width = this._calculateIntroElem2Width(this._introProggress) + 'px';
//	this._introElem2.style.top = (window.innerHeight - this._introElem2.offsetHeight) / 2 - ((window.innerHeight - this._introElem2.offsetHeight) / 2 - 20) * (this._introProggress / 100) + 'px';
	this._introElem2.style.top = this._calculateIntroElem2Top(this._introProggress) + 'px';
	this._introElem2.style.left = this._calculateIntroElem2Left(this._introProggress) + 'px';
	this._introElem3.style.background = 'rgba(0, 0, 0, ' + this._introProggress / 100 + ')';
	this._introElem4.style.background = 'rgba(0, 0, 0, ' + this._introProggress / 100 + ')';

	if (this._introProggress === 100) {
		this._introEnd();
	}
};

FirstSlideIntro.prototype._calculateIntroElem2Width = function(progressPercents) {
	var progress = progressPercents  / 100;
	var maxWidth = window.innerWidth < 400 ? window.innerWidth : 400;
	var minWidth = 110;

	return maxWidth - (maxWidth - minWidth) * progress;
};

FirstSlideIntro.prototype._calculateIntroElem2Left = function(progressPercents) {
	var progress = progressPercents  / 100;
	var startLeft = (window.innerWidth - this._introElem2.offsetWidth) / 2;
	var endLeft = ['xs', 'sm'].indexOf(this._checkScreenWidth()) !== -1 ? 0 : (window.innerWidth - this._introElem2.offsetWidth) / 2;

	return startLeft - (startLeft - endLeft) * progress;
};

FirstSlideIntro.prototype._calculateIntroElem2Top = function(progressPercents) {
	var progress = progressPercents  / 100;
	var startTop = ['xs', 'sm'].indexOf(this._checkScreenWidth()) !== -1 ? (window.innerHeight - this._introElem2.offsetHeight - this._logoElems[1].offsetHeight - this._logoElems[2].offsetHeight - this._logoElems[3].offsetHeight) / 2 - 60 : (window.innerHeight - this._introElem2.offsetHeight - this._logoElems[1].offsetHeight - this._logoElems[2].offsetHeight - this._logoElems[3].offsetHeight) / 2 ;
	var endTop = 20;

	return startTop - (startTop - endTop) * progress;
};

FirstSlideIntro.prototype._calculateIntroElem5Height = function(progressPercents) {
	var height = 0;

	if (progressPercents > 0) {
		if (['xs', 'sm'].indexOf(this._checkScreenWidth()) !== -1) {

		} else {
			height += this._logoElems[1].offsetHeight;
		}

	} else {
		height += this._logoElems[1].offsetHeight;
		height += this._logoElems[2].offsetHeight;
		height += this._logoElems[3].offsetHeight;
	}

	return height;
};

FirstSlideIntro.prototype._changeLogoUrls = function(increment) {
	for (var i = 0; i < this._logoElems.length; i++) {
		this._logoElems[i].setAttribute('src', this._smallLogoUrls[i]);
	}
};

FirstSlideIntro.prototype._introEnd = function() {
	this._sendCustomEvent(document, 'firstSlideIntro', {bubbles: true, detail: {preventPageSlideScrolling: false}});
	document.body.classList.add('intro_complete');

	this._removeListener(window, 'wheel', this._onMouseWheel);
	this._removeListener(document, 'touchstart', this._onTouchStart);
	this._removeListener(document, 'touchmove', this._onTouchMove);
	this._removeListener(document, 'touchend', this._onTouchEnd);
};

try {
	module.exports = FirstSlideIntro;
} catch (err) {
	console.warn(err);
}
