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

	this._animatedItemsApperanceStartOffset = options.animatedItemsApperanceStartOffset || 50;
	this._animatedItemsApperanceDelay = options.animatedItemsApperanceDelay || 200;
	this._animatedItemsApperanceDuration = options.animatedItemsApperanceDuration || 400;

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
			this._addListener(window, 'wheel', this._onMouseWheel);
			this._addListener(document, 'touchstart', this._onTouchStart);
			this._animateScrollIcon( this._animateScrollIcon.bind(this, this._animateScrollIcon.bind(this, null, true) ) );
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

FirstSlideIntro.prototype._animateScrollIcon = function(callback, showOnly) {
	var scrollAnimatedIcon2 = this._elem.querySelector('.scroll_icon .animated_container .icon_scroll_part2');
	var scrollAnimatedIcon3 = this._elem.querySelector('.scroll_icon .animated_container .icon_scroll_part3');

	var duration = 250;

	setTimeout(
		function() {
			scrollAnimatedIcon2.classList.add('show');

			setTimeout(
				function() {
					scrollAnimatedIcon3.classList.add('show');

					if (showOnly) {
						return;
					}

					setTimeout(
						function() {
							scrollAnimatedIcon2.classList.remove('show');

							setTimeout(
								function() {
									scrollAnimatedIcon3.classList.remove('show');

									if (callback) {
										callback();
									}
								},
								duration
							);
						},
						duration
					);
				},
				duration
			);
		},
		duration
	);
};

FirstSlideIntro.prototype._onMouseWheel = function(e) {
	if (!e.deltaY || this._scrollInProcess) return;

	if (e.deltaY > 0) {
//		this._playIntro(this._increment);
		this._playFullIntroAnimated();
		this._removeListener(window, 'wheel', this._onMouseWheel);
		this._removeListener(document, 'touchstart', this._onTouchStart);
		this._removeListener(document, 'touchmove', this._onTouchMove);
		this._removeListener(document, 'touchend', this._onTouchEnd);
	} /*else if (e.deltaY < 0) {
		this._playIntro(-this._increment);

	}*/
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

//	this._playIntro(-yPositionDeleta * 0.25);
	if (-yPositionDeleta > 0) {
		this._playFullIntroAnimated();
		this._removeListener(window, 'wheel', this._onMouseWheel);
		this._removeListener(document, 'touchstart', this._onTouchStart);
		this._removeListener(document, 'touchmove', this._onTouchMove);
		this._removeListener(document, 'touchend', this._onTouchEnd);
	}

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

	} else if (increment < 0) {
		if (this._introProggress > 0) {
			this._intro_1(increment);
		}

	} else if (increment === 0) {
		this._intro_1(0);
	}
};

FirstSlideIntro.prototype._intro_1 = function(increment) {
	if (increment) {
		this._introProggress += increment;
	}

	if (this._introProggress < 0) {
		this._introProggress = 0;
	} else if (this._introProggress > 100) {
		this._introProggress = 100;
	}

	this._introElem5.style.height = this._calculateIntroElem5Height(this._introProggress) + 'px';

	this._introElem1.style.background = 'rgba(1, 0, 0, ' + (1 - this._introProggress / 100) + ')';
	if (this._introProggress === 100) {
		this._introElem1.style.height = 0;
		this._changeLogoUrls();
	} else {
		this._introElem1.style.height = 100 + '%';
	}
	this._introElem2.style.width = this._calculateIntroElem2Width(this._introProggress) + 'px';
	this._introElem2.style.top = this._calculateIntroElem2Top(this._introProggress) + 'px';
	this._introElem2.style.left = this._calculateIntroElem2Left(this._introProggress) + 'px';
	this._introElem3.style.background = 'rgba(0, 0, 0, ' + this._introProggress / 100 + ')';
	this._introElem4.style.background = 'rgba(0, 0, 0, ' + this._introProggress / 100 + ')';

	if (this._introProggress === 100) {
		this._introEnd();
		this._intro_2();
	}
};

FirstSlideIntro.prototype._intro_2 = function(increment) {
	if (this._intro2Played) {
		return;
	}

	this._intro2Played = true;

	var slide1Text = document.querySelector('#slide1 .text_block');
	var slide1Sidebar = document.querySelector('#slide1 .sidebar');
	var slide1ScrollIcon = document.querySelector('#slide1 .scroll_icon');
	var sideMenu = document.querySelector('.side_menu');

	this._animateItemsArr = slide1Text.querySelectorAll('.animated_item');

	slide1Text.style.transform = 'translateX(-150%)';
	slide1Sidebar.style.transform = 'translateX(-100%)';
	slide1ScrollIcon.style.opacity = 0;
	sideMenu.style.transform = 'translateX(200%)';

	this._preOpenInit();

	var duration = 400;

	this._introAnimation = new Animation(
		function(timePassed) {
			var timeMuliplier = Animation.linear(duration, timePassed);

			slide1Sidebar.style.transform = 'translateX(-' + (100 - 100 * timeMuliplier) + '%)';
		}.bind(this),
		duration,
		function() {
			this._introAnimation = new Animation(
				function(timePassed) {
					var timeMuliplier = Animation.linear(duration * 1.5, timePassed);

					slide1Text.style.transform = 'translateX(-' + (150 - 150 * timeMuliplier) + '%)';
				}.bind(this),
				duration * 1.5,
				function() {
					this._introAnimation = new Animation(
						function(timePassed) {
							var timeMuliplier = Animation.linear(duration, timePassed);

							sideMenu.style.transform = 'translateX(' + (200 - 200 * timeMuliplier) + '%)';
						}.bind(this),
						duration,
						function() {

							delete this._introAnimation;

							this._showAnimatedItems( function(){

								this._introAnimation = new Animation(
									function(timePassed) {
										var timeMuliplier = Animation.linear(duration, timePassed);

										slide1ScrollIcon.style.opacity = timeMuliplier;
									}.bind(this),
									duration,
									function() {
										delete this._introAnimation;
									}.bind(this)
								);

							}.bind(this) );
						}.bind(this)
					);

				}.bind(this)
			);
		}.bind(this)
	);
};

FirstSlideIntro.prototype._preOpenInit = function() {
	this._animateItemsStartingPositionArr = [];
	this._animateItemsStartingPositionTypeArr = [];

	var position,
		initalOffset;

	for (var i = 0; i < this._animateItemsArr.length; i++) {
		position = getComputedStyle(this._animateItemsArr[i]).position;
		this._animateItemsStartingPositionTypeArr[i] = position;

		if (this._animateItemsStartingPositionTypeArr[i] === 'absolute') {
			this._animateItemsArr[i].style.position = 'absolute';
		} else {
			this._animateItemsArr[i].style.position = 'relative';
		}

		initalOffset = parseFloat(getComputedStyle(this._animateItemsArr[i]).right);
		this._animateItemsStartingPositionArr[i] = initalOffset;

		this._animateItemsArr[i].style.opacity = 0;
		this._animateItemsArr[i].style.right = this._animateItemsStartingPositionArr[i] + this._animatedItemsApperanceStartOffset + 'px';
		this._animateItemsArr[i].style.left = 'auto';
	}
};

FirstSlideIntro.prototype._showAnimatedItems = function( callback ) {
	this._animateItemsAnimated = [];

	this._showAnimatedItem(0, callback);
};

FirstSlideIntro.prototype._showAnimatedItem = function(index, callback) {
	if (!this._animateItemsArr[index]) {
		delete this._animateItemsAnimated;
		return;
	}

	this._animateItemsAnimated[index] = true;

	var startAnimationPosition = this._animateItemsStartingPositionArr[index] + this._animatedItemsApperanceStartOffset;

	new Animation(
		function(timePassed) {
			var timeMultiplier = Animation.linear(this._animatedItemsApperanceDuration, timePassed),
				right = startAnimationPosition - this._animatedItemsApperanceStartOffset * timeMultiplier;

			this._animateItemsArr[index].style.right = right + 'px';
			this._animateItemsArr[index].style.opacity = timeMultiplier;

			if (timePassed >= this._animatedItemsApperanceDelay && this._animateItemsAnimated && !this._animateItemsAnimated[index + 1]) {
				this._showAnimatedItem(index + 1, callback);
			}
		}.bind(this),
		this._animatedItemsApperanceDuration,
		function() {
			this._animateItemsArr[index].style.position = '';
			this._animateItemsArr[index].style.opacity = '';
			this._animateItemsArr[index].style.right = '';
			this._animateItemsArr[index].style.left = '';

			if (!this._animateItemsArr[index + 1]) {
				callback();
			}

			if (this._animatedItemsApperanceDelay > this._animatedItemsApperanceDuration) {
				var self = this;
				setTimeout(
					self._showAnimatedItem.bind(self)(index + 1, callback),
					self._animatedItemsApperanceDelay - self._animatedItemsApperanceDuration
				);
			}
		}.bind(this)
	);
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
	if (this._introEndPlayed) {
		return;
	}

	this._introEndPlayed = true;

	this._sendCustomEvent(document, 'firstSlideIntro', {bubbles: true, detail: {preventPageSlideScrolling: false}});
	document.body.classList.add('intro_complete');

	this._removeListener(window, 'wheel', this._onMouseWheel);
	this._removeListener(document, 'touchstart', this._onTouchStart);
	this._removeListener(document, 'touchmove', this._onTouchMove);
	this._removeListener(document, 'touchend', this._onTouchEnd);
};

FirstSlideIntro.prototype._playFullIntroAnimated = function() {
	var duration = 1000;

	this._introAnimation = new Animation(
		function(timePassed) {
			var progress = Animation.linear(duration, timePassed);
			var increment = progress * 100 - this._introProggress;
			this._playIntro(increment);
		}.bind(this),
		duration,
		function() {
			delete this._introAnimation;
		}.bind(this)
	);
};

try {
	module.exports = FirstSlideIntro;
} catch (err) {
	console.warn(err);
}
