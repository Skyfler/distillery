"use strict";

try {
	var Helper = require('./helper');
	var Animation = require('./animation');
} catch (err) {
	console.warn(err);
}

function SliderControlls(options) {
	options.name = options.name || 'SliderControlls';
	Helper.call(this, options);

	this._elem = options.elem;
	this._slidesCount = options.slidesCount;
	this._animationDuration = options.animationDuration || 500;
	this._slider = options.slider;
	this._sliderElem = options.sliderElem;
	this._sliderSelector = options.sliderSelector;

	this._onClick = this._onClick.bind(this);
	this._onSliderSlideChanged = this._onSliderSlideChanged.bind(this);

	this._init();
}

SliderControlls.prototype = Object.create(Helper.prototype);
SliderControlls.prototype.constructor = SliderControlls;

SliderControlls.prototype._init = function() {
	this._listElem = this._elem.querySelector('.slider_dot_controlls_list');
//	this._listElem = this._elem;
	if (!this._listElem) return;

	this._listElem.innerHTML = this._createList();
	this._controllsElemsArr = this._listElem.querySelectorAll('.slider_dot_controll');
	this._controllsVisible = false;

	this._setActive(this._slider.getActiveSlideIndex());

	this._addListener(this._elem, 'click', this._onClick);
	this._addListener(document, 'sliderSlideChanged', this._onSliderSlideChanged);
};

SliderControlls.prototype._createList = function() {
	var listHtml = '',
		listItemHtml = '<li class="slider_dot_controll" data-component="slider_control" data-slide-index="{index}"></li>',
		listItemDcorationHtml = '<li class="dot_controll_decoration"></li>';

	for (var i = 0; i < this._slidesCount; i++) {
		if (i > 0) {
			listHtml += listItemDcorationHtml;
		}
		listHtml += listItemHtml.replace('{index}', i + 1);
	}

	return listHtml;
};

SliderControlls.prototype._onClick = function(e) {
	var target = e.target;

	this._controlSlider(target);
};

SliderControlls.prototype._onSliderSlideChanged = function(e) {
	var slideIndex = e.detail.slideIndex;
	var slider = e.detail.slider;
	if (slideIndex === undefined || this._slider !== slider) return;

	this._setActive(slideIndex);
};

SliderControlls.prototype._setActive = function(index) {
	for (var i = 0; i < this._controllsElemsArr.length; i++) {
		this._controllsElemsArr[i].classList.remove('active');
	}

	var activeControll = this._listElem.querySelector('[data-slide-index="' + index + '"]');
	if (activeControll) {
		activeControll.classList.add('active');
	}
};

SliderControlls.prototype._controlSlider = function(target) {
	var control = target.closest('[data-component="slider_control"]');
	if (!control) return;
	var slideIndex = control.dataset.slideIndex;
	if (!slideIndex) return;

	var targetSlider = this._slider || this._sliderElem || this._sliderSelector || false;
	this._sendCustomEvent(document, 'sliderControl', { bubbles: true, detail: {slideIndex: parseInt(slideIndex), targetSlider: targetSlider} });
};

SliderControlls.prototype.show = function() {
	this.visible = true;

	if (this._animation) {
		this._animation.stop(true);
		delete this._animation;
	}

	this._elem.classList.remove('hidden');

	this._animation = new Animation(
		function(timePassed) {
			var timeMuliplier = Animation.linear(this._animationDuration, timePassed);

			this._elem.style.opacity = timeMuliplier;
		}.bind(this),
		this._animationDuration,
		function() {
			delete this._animation;
		}.bind(this)
	);
};

SliderControlls.prototype.hide = function() {
	this.visible = false;

	if (this._animation) {
		this._animation.stop(true);
		delete this._animation;
	}

	this._animation = new Animation(
		function(timePassed) {
			var timeMuliplier = Animation.linear(this._animationDuration, timePassed);

			this._elem.style.opacity = 1 - timeMuliplier;
		}.bind(this),
		this._animationDuration,
		function() {
			delete this._animation;
			this._elem.classList.add('hidden');
		}.bind(this)
	);
};

try {
	module.exports = SliderControlls;
} catch (err) {
	console.warn(err);
}
