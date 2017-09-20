"use strict";

try {
	var Helper = require('./helper');
	var ImgLabels = require('./imgLabels');
} catch (err) {
	console.warn(err);
}

function ConfigurationBlock(options) {
	options.name = options.name || 'PageSlide5Controller-ConfigurationBlock';
	Helper.call(this, options);

	this._elem = options.elem;
	this._sideMenuTabsSelector = options.sideMenuTabsSelector;
	this._id = this._elem.id || false;

	this._onClick = this._onClick.bind(this);

	this._init();
}

ConfigurationBlock.prototype = Object.create(Helper.prototype);
ConfigurationBlock.prototype.constructor = ConfigurationBlock;

ConfigurationBlock.prototype._init = function() {
	this._initImgLabels();

	if (this._labelsSvgArr.length > 0) {
		this._showConfigurationImage(this._labelsSvgArr[0].getId());
	}

	this._addListener(this._elem, 'click', this._onClick);
};

ConfigurationBlock.prototype.show = function() {
	this._elem.classList.remove('hidden');
};

ConfigurationBlock.prototype.hide = function() {
	this._elem.classList.add('hidden');
};

ConfigurationBlock.prototype.getId = function() {
	return this._id;
};

ConfigurationBlock.prototype._initImgLabels = function() {
	var labelsSvgElemsArr = this._elem.querySelectorAll('.svg_lines');

	this._labelsSvgArr = [];

	for (var i = 0; i < labelsSvgElemsArr.length; i++) {
		this._labelsSvgArr.push( new ImgLabels({
			elem: labelsSvgElemsArr[i],
			labelElemsDataArr: [
				{
					elem: labelsSvgElemsArr[i].querySelector('.label1'),
					corner: {
						xs: 'bottom-right',
						sm: 'bottom-right',
						md: 'bottom-right',
						lg: 'bottom-right'
					},
					imagePercentCoords: {
						xs: {
							x: 73.1,
							y: 28
						},
						sm: {
							x: 73.1,
							y: 28
						},
						md: {
							x: 73.1,
							y: 28
						},
						lg: {
							x: 73.1,
							y: 28
						}
					},
				}
			]
		}) );
	}

	this._sideMenuTabsArr = this._elem.querySelectorAll(this._sideMenuTabsSelector);
};

ConfigurationBlock.prototype._onClick = function(e) {
	var target = e.target;
	if (!target) return;

	var actionElement = target.closest('[data-action][data-target-id]');
	if (!actionElement) return;

	var action = actionElement.dataset.action;
	var targetId = actionElement.dataset.targetId;
	if (!action || !targetId) return;

	if (action === 'show-conf-img' && this._showConfigurationImage(targetId)) {
		e.preventDefault();
	}
};

ConfigurationBlock.prototype._showConfigurationImage = function(targetImageId) {
	var imageFound = false;

	for (var i = 0, image; i < this._labelsSvgArr.length; i++) {
		image = this._labelsSvgArr[i];
		if (!imageFound && image.getId() === targetImageId) {
			image.show();
			imageFound = true;
		} else {
			image.hide();
		}
	}

	for (var i = 0, tab, tabFound; i < this._sideMenuTabsArr.length; i++) {
		tab = this._sideMenuTabsArr[i];
		if (!tabFound
			&& tab.dataset.targetId === targetImageId
			&& tab.dataset.action === 'show-conf-img') {
			tabFound = true;
			tab.classList.add('active');
		} else {
			tab.classList.remove('active');
		}
	}

	return imageFound;
};

try {
	module.exports = ConfigurationBlock;
} catch (err) {
	console.warn(err);
}
