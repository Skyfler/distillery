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
	this._onResize = this._onResize.bind(this);

	this._init();
}

PageSlide4Controller.prototype = Object.create(Helper.prototype);
PageSlide4Controller.prototype.constructor = PageSlide4Controller;

PageSlide4Controller.prototype._init = function() {
	this._initSlider();

	this._slideBgImages = this._elem.querySelectorAll('.slider_bg_img');

	this._controllImagesHeight();

	this._addListener(document, 'pageSlideChanged', this._onPageSlideChanged);
	this._addListener(window, 'resize', this._onResize);
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

PageSlide4Controller.prototype._controllImagesHeight = function() {
	var length = this._slideBgImages.length,
		i,
		imageHeight,
		imageWidth,
		parentBox,
		parentHeight,
		parentWidth,
		imageProportion,
		parentProportion;
	for (i = 0; i < length; i++) {
		imageHeight = this._slideBgImages[i].offsetHeight;
		imageWidth = this._slideBgImages[i].offsetWidth;
		parentBox = this._slideBgImages[i].closest('.slider_slide').getBoundingClientRect();
		parentHeight = parentBox.height;
		parentWidth = parentBox.width;

		imageProportion = imageHeight / imageWidth;
		parentProportion = parentHeight / parentWidth;

		if (imageProportion > parentProportion) {
			this._slideBgImages[i].style.height = '';
			this._slideBgImages[i].style.width = parentWidth + 'px';
		} else if (imageProportion < parentProportion) {
			this._slideBgImages[i].style.width = '';
			this._slideBgImages[i].style.height = parentHeight + 'px';
		}
	}
};

PageSlide4Controller.prototype._onResize = function(e) {
	this._controllImagesHeight();
};

try {
	module.exports = PageSlide4Controller;
} catch (err) {
	console.warn(err);
}
