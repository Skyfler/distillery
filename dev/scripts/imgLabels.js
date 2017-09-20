"use strict";

try {
	var Helper = require('./helper');
	var Animation = require('./animation');
} catch (err) {
	console.warn(err);
}

function ImgLabels(options) {
	options.name = options.name || 'ImgLabels';
	Helper.call(this, options);

	this._elem = options.elem;
	this._labelElemsDataArr = options.labelElemsDataArr;
	this._id = this._elem.id || false;

	this._onResize = this._onResize.bind(this);
	this._onPageSlideChangedAnimationEnd = this._onPageSlideChangedAnimationEnd.bind(this);

	this._init();
}

ImgLabels.prototype = Object.create(Helper.prototype);
ImgLabels.prototype.constructor = ImgLabels;

ImgLabels.prototype._init = function() {
	this._svgElem = this._elem.querySelector('.svg_layer');
	this._imageElem = this._elem.querySelector('img');

	this._draw();
	this._initAnimatableElems();

	this._addListener(window, 'resize', this._onResize);
	this._addListener(document, 'pageSlideChangedAnimationEnd', this._onPageSlideChangedAnimationEnd);
};

ImgLabels.prototype.show = function() {
	this._elem.classList.remove('hidden');
	this._onResize();
};

ImgLabels.prototype.hide = function() {
	this._elem.classList.add('hidden');
};

ImgLabels.prototype.getId = function() {
	return this._id;
};

ImgLabels.prototype._draw = function() {
	var svgHtml = '';

	svgHtml += this._createLinkLines();

	this._svgElem.innerHTML = svgHtml;
};

ImgLabels.prototype._createLinkLines = function() {
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

ImgLabels.prototype._createLinkLine = function(blockElem, blockCorner, imagePercentCoords) {
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

ImgLabels.prototype._calculateImageCoords = function(imagePercentCoords) {
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

ImgLabels.prototype._initAnimatableElems = function() {
	this._animatableElemArr = Array.prototype.slice.call(this._elem.querySelectorAll('.animatable'));

	for (var i = 0; i < this._animatableElemArr.length; i++) {
		this._animatableElemArr[i].style.opacity = 0;
		this._animatableElemArr[i].style.top = -10 + 'px';
	}
};

ImgLabels.prototype._showAnimatableElems = function(elemsArr, callback) {
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

ImgLabels.prototype._onPageSlideChangedAnimationEnd = function(e) {
	var activeSlideID = e.detail.activeSlideID,
		activeSlideElem = e.detail.activeSlideElem;

	if (!this._lablesDisplayed && activeSlideElem.contains(this._elem)) {
		this._showAnimatableElems(this._animatableElemArr, function() { this._lablesDisplayed = true; }.bind(this));
	}
};

ImgLabels.prototype._onResize = function() {
	if (!this._svgElem) return;

	this._draw();
};

try {
	module.exports = ImgLabels;
} catch (err) {
	console.warn(err);
}
