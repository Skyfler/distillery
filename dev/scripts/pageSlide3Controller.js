"use strict";

try {
	var Helper = require('./helper');
	var Animation = require('./animation');
} catch (err) {
	console.warn(err);
}

function PageSlide3Controller(options) {
	options.name = options.name || 'PageSlide3Controller';
	Helper.call(this, options);

	this._elem = options.elem;
	this._colLeft = options.colLeft;
	this._labelElemsDataArr = options.labelElemsDataArr;

	this._onResize = this._onResize.bind(this);
	this._onDetailsClick = this._onDetailsClick.bind(this);
	this._onBackClick = this._onBackClick.bind(this);
	this._onPageSlideChangedAnimationEnd = this._onPageSlideChangedAnimationEnd.bind(this);

	this._init();
}

PageSlide3Controller.prototype = Object.create(Helper.prototype);
PageSlide3Controller.prototype.constructor = PageSlide3Controller;

PageSlide3Controller.prototype._init = function() {
	this._svgElem = this._elem.querySelector('.svg_layer');
	this._imageElem = this._elem.querySelector('img');

	this._draw();
	this._initAnimatableElems();

	this._addListener(window, 'resize', this._onResize);
	this._addListener(this._elem.querySelector('.details'), 'click', this._onDetailsClick);
	this._addListener(this._colLeft.querySelector('.back'), 'click', this._onBackClick);
	this._addListener(document, 'pageSlideChangedAnimationEnd', this._onPageSlideChangedAnimationEnd);
};

PageSlide3Controller.prototype._onDetailsClick = function() {
	if (['xs', 'sm'].indexOf(this._checkScreenWidth()) === -1) return;

	this._colLeft.style.display = 'block';
};

PageSlide3Controller.prototype._onBackClick = function() {
	if (['xs', 'sm'].indexOf(this._checkScreenWidth()) === -1) return;

	this._colLeft.style.display = '';
};

PageSlide3Controller.prototype._draw = function() {
	var svgHtml = '';

	svgHtml += this._createLinkLines();

	this._svgElem.innerHTML = svgHtml;
};

PageSlide3Controller.prototype._createLinkLines = function() {
	var html = '',
		widthMode = this._checkScreenWidth();

	for (var i = 0; i < this._labelElemsDataArr.length; i++) {
		html += this._createLinkLine(
			this._labelElemsDataArr[i].elem,
			this._labelElemsDataArr[i].corner[widthMode],
			this._labelElemsDataArr[i].imagePercentCoords[widthMode]
		);

		this._labelElemsDataArr[i].elem.dataset.corner = this._labelElemsDataArr[i].corner[widthMode];
	}

	return html;
};

PageSlide3Controller.prototype._createLinkLine = function(blockElem, blockCorner, imagePercentCoords) {
	var widthMultiplier,
		heightMultiplier;

	var blockLineMargin = 5,
		blockCornerLineWidth = 17,
		blockCornerLineOffset = 3,
		connectionPointInnerWidth = 8,
		connectionPointOuterWidth = 16;

	if ((blockCorner === 'top-right') || (blockCorner === 'bottom-right')) {
		widthMultiplier = 1;
	} else {
		widthMultiplier = 0;
	}
	if ((blockCorner === 'bottom-left') || (blockCorner === 'bottom-right')) {
		heightMultiplier = 1;
	} else {
		heightMultiplier = 0;
	}

	var imagePixelCoords = this._calculateImageCoords(imagePercentCoords);

	var blockX = blockElem.offsetLeft + Math.pow(-1, widthMultiplier) * ((blockElem.offsetWidth - blockElem.clientWidth) / 2) + blockElem.offsetWidth * widthMultiplier - blockCornerLineOffset + blockCornerLineOffset * 2 * widthMultiplier;
	var blockY = blockElem.offsetTop + Math.pow(-1, heightMultiplier) * ((blockElem.offsetHeight - blockElem.clientHeight) / 2) + blockElem.offsetHeight * heightMultiplier - blockCornerLineOffset + blockCornerLineOffset * 2 * heightMultiplier;
	var imageX = imagePixelCoords.x;
	var imageY = imagePixelCoords.y;

	var a1 = imageY - blockY;
	var b1 = imageX - blockX;
	var c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));

	var c2 = blockLineMargin;
	var mult = c2 / (c1 / 100) / 100;
	var a2 = a1 * mult;
	var b2 = b1 * mult;

	var edgeLineHorizontalHtml = '<line class="link_line"' +
		' x1="' + blockX + '" y1="' + blockY + '"' +
		' x2="' + (blockX - blockCornerLineWidth + blockCornerLineWidth * 2 * !widthMultiplier) + '" y2="' + blockY + '"' +
		'/>';
	var edgeLineVerticalHtml = '<line class="link_line"' +
		' x1="' + blockX + '" y1="' + blockY + '"' +
		' x2="' + blockX + '" y2="' + (blockY - blockCornerLineWidth + blockCornerLineWidth * 2 * !heightMultiplier) + '"' +
		'/>';

	var connectionPointInnerHtml = '<rect class="connection_point_inner" transform="rotate(' + 45 + ' ' + imageX + ' ' + imageY +')"' +
		' x="' + (imageX - connectionPointInnerWidth / 2) + '" y="' + (imageY - connectionPointInnerWidth / 2) + '"' +
		' width="' + connectionPointInnerWidth + '" height="' + connectionPointInnerWidth + '"' +
		'/>';
	var connectionPointOuterHtml = '<rect class="connection_point_outer" transform="rotate(' + 45 + ' ' + imageX + ' ' + imageY +')"' +
		' x="' + (imageX - connectionPointOuterWidth / 2) + '" y="' + (imageY - connectionPointOuterWidth / 2) + '"' +
		' width="' + connectionPointOuterWidth + '" height="' + connectionPointOuterWidth + '"' +
		'/>';

	var lineHtml = '<line class="link_line"' +
		' x1="' + (blockX + b2) + '" y1="' + (blockY + a2) + '"' +
		' x2="' + (imageX - connectionPointOuterWidth / 2 + connectionPointOuterWidth * !widthMultiplier) + '" y2="' + (imageY - connectionPointOuterWidth / 2 + connectionPointOuterWidth * !heightMultiplier) + '"' +
		'/>';

//	var connectionPointHtml = '<circle class="connection_point"' +
//		' cx="' + circleX + '" cy="' + circleY + '" r="' + 3 + '"' +
//		'></circle>';
	return lineHtml + edgeLineHorizontalHtml + edgeLineVerticalHtml + connectionPointInnerHtml + connectionPointOuterHtml;
};

PageSlide3Controller.prototype._calculateImageCoords = function(imagePercentCoords) {
	var width = this._imageElem.offsetWidth;
	var height = this._imageElem.offsetHeight;

	var imageX = width * (imagePercentCoords.x / 100);
	var imageY = height * (imagePercentCoords.y / 100);

	var x = this._imageElem.offsetLeft + imageX;
	var y = this._imageElem.offsetTop + imageY;

	return {
		x: x,
		y: y
	}
};

PageSlide3Controller.prototype._initAnimatableElems = function() {
	this._animatableElemArr = Array.prototype.slice.call(this._elem.querySelectorAll('.animatable'));

	for (var i = 0; i < this._animatableElemArr.length; i++) {
		this._animatableElemArr[i].style.opacity = 0;
		this._animatableElemArr[i].style.top = -10 + 'px';
	}
};

PageSlide3Controller.prototype._showAnimatableElems = function(elemsArr, callback) {
	if (elemsArr.length === 0) {
		if (callback) {
			callback();
		}

		return;
	};

	var animationDuration = 200;
	var currentAnimatedElem = elemsArr[0];

	this._animation = new Animation(
		function(timePassed) {
			var timeMuliplier = Animation.linear(animationDuration, timePassed);
			currentAnimatedElem.style.opacity = timeMuliplier;
			currentAnimatedElem.style.top = -10 + 10 * timeMuliplier + 'px';
		}.bind(this),
		animationDuration,
		function() {
			delete this._animation;
			this._showAnimatableElems(elemsArr.slice(1), callback);
		}.bind(this)
	);
};

PageSlide3Controller.prototype._onPageSlideChangedAnimationEnd = function(e) {
	var activeSlideID = e.detail.activeSlideID,
		activeSlideElem = e.detail.activeSlideElem;

	if (!this._lablesDisplayed && activeSlideElem.contains(this._elem)) {
		this._showAnimatableElems(this._animatableElemArr, function() { this._lablesDisplayed = true; }.bind(this));
	}
};

PageSlide3Controller.prototype._onResize = function() {
	if (['xs', 'sm'].indexOf(this._checkScreenWidth()) === -1) {
		this._colLeft.style.display = '';
	}

	if (!this._svgElem) return;

	this._draw();
};

try {
	module.exports = PageSlide3Controller;
} catch (err) {
	console.warn(err);
}
