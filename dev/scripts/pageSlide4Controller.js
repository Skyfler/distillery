"use strict";

try {
	var Helper = require('./helper');
	var Slider = require('./slider');
	var SliderControlls = require('./slider-sliderControlls');
} catch (err) {
	console.warn(err);
}

function PageSlide4Controller(options) {
	options.name = options.name || 'PageSlide4Controller';
	Helper.call(this, options);

	this._elem = options.elem;
	this._pageSlidesSliderActive = options.pageSlidesSliderActive instanceof Array ? options.pageSlidesSliderActive : [options.pageSlidesSliderActive];

	this._onPageSlideChanged = this._onPageSlideChanged.bind(this);

	this._init();
}

PageSlide4Controller.prototype = Object.create(Helper.prototype);
PageSlide4Controller.prototype.constructor = PageSlide4Controller;

PageSlide4Controller.prototype._init = function() {
	this._initSlider();

	this._addListener(document, 'pageSlideChanged', this._onPageSlideChanged);
};

PageSlide4Controller.prototype._initSlider = function() {
	var sliderElem = this._elem.querySelector('#slider');
	if (sliderElem) {
		this._slider = new Slider({
			elem: sliderElem,
			delay: 0,
			breakPoint: 0
		});

		var sliderControllsElem = document.querySelector('#page_slide4_slider_controlls');
		if (sliderControllsElem) {
			this._sliderControlls = new SliderControlls({
				elem: sliderControllsElem,
				slidesCount: this._slider.getSlidesCount(),
				slider: this._slider
			});
		}
	}
};

PageSlide4Controller.prototype._onPageSlideChanged = function(e) {
	var slideID = e.detail.activeSlideID;

	if (this._pageSlidesSliderActive.indexOf(slideID) !== -1 && !this._sliderControlls.visible) {
		this._sliderControlls.show();
	} else if (this._pageSlidesSliderActive.indexOf(slideID) === -1 && this._sliderControlls.visible) {
		this._sliderControlls.hide();
	}
};

try {
	module.exports = PageSlide4Controller;
} catch (err) {
	console.warn(err);
}
