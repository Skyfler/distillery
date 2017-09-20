"use strict";

try {
	var Helper = require('./helper');
	var Slider = require('./slider');
	var SliderControlls = require('./slider-sliderControlls');
} catch (err) {
	console.warn(err);
}

function PreviewBlock(options) {
	options.name = options.name || 'PageSlide5Controller-PreviewBlock';
	Helper.call(this, options);

	this._elem = options.elem;
	this._pageSlidesSliderActive = options.pageSlidesSliderActive instanceof Array ? options.pageSlidesSliderActive : [options.pageSlidesSliderActive];

	this._onPageSlideChanged = this._onPageSlideChanged.bind(this);

	this._init();
}

PreviewBlock.prototype = Object.create(Helper.prototype);
PreviewBlock.prototype.constructor = PreviewBlock;

PreviewBlock.prototype._init = function() {
	this._initSlider();

	this._addListener(document, 'pageSlideChanged', this._onPageSlideChanged);
};

PreviewBlock.prototype.show = function() {
	this._elem.classList.remove('hidden');
	this._hidden = false;
	this._sliderControlls.show();
};

PreviewBlock.prototype.hide = function() {
	this._elem.classList.add('hidden');
	this._hidden = true;
	this._sliderControlls.hide();
};

PreviewBlock.prototype._initSlider = function() {
	var sliderElem = this._elem.querySelector('#prewiev_slider');
	if (sliderElem) {
		this._slider = new Slider({
			elem: sliderElem,
			delay: 0,
			breakPoint: {
				min: 0,
				max: 991
			}
		});

		var sliderControllsElem = document.querySelector('#page_slide5_slider_controlls');
		if (sliderControllsElem) {
			this._sliderControlls = new SliderControlls({
				elem: sliderControllsElem,
				slidesCount: this._slider.getSlidesCount(),
				slider: this._slider
			});
		}
	}
};

PreviewBlock.prototype._onPageSlideChanged = function(e) {
	var slideID = e.detail.activeSlideID;

	if (!this._hidden && this._pageSlidesSliderActive.indexOf(slideID) !== -1 && !this._sliderControlls.visible) {
		this._sliderControlls.show();
	} else if (this._pageSlidesSliderActive.indexOf(slideID) === -1 && this._sliderControlls.visible) {
		this._sliderControlls.hide();
	}
};

try {
	module.exports = PreviewBlock;
} catch (err) {
	console.warn(err);
}
