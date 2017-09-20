"use strict";

try {
	var Helper = require('./helper');
	var ConfigurationBlock = require('./pageSlide5Controller-configurationBlock');
	var PreviewBlock = require('./pageSlide5Controller-previewBlock');
} catch (err) {
	console.warn(err);
}

function PageSlide5Controller(options) {
	options.name = options.name || 'PageSlide5Controller';
	Helper.call(this, options);

	this._elem = options.elem;
	this._configurationBlockSelector = options.configurationBlockSelector;
	this._previewBlockSelector = options.previewBlockSelector;

	this._onClick = this._onClick.bind(this);

	this._init();
}

PageSlide5Controller.prototype = Object.create(Helper.prototype);
PageSlide5Controller.prototype.constructor = PageSlide5Controller;

PageSlide5Controller.prototype._init = function() {
	this._initConfigurationBlocks();
	this._initPreviewBlock();

	this._addListener(this._elem, 'click', this._onClick);
};

PageSlide5Controller.prototype._initPreviewBlock = function() {
	var previewBlockElem = this._elem.querySelector(this._previewBlockSelector);

	this._preview = new PreviewBlock({
		elem: previewBlockElem,
		pageSlidesSliderActive: 'slide5'
	});
};

PageSlide5Controller.prototype._initConfigurationBlocks = function() {
	var configurationBlockElemsArr = this._elem.querySelectorAll(this._configurationBlockSelector);

	this._configurationBlocksArr = [];

	for (var i = 0; i < configurationBlockElemsArr.length; i++) {
		this._configurationBlocksArr.push( new ConfigurationBlock({
			elem: configurationBlockElemsArr[i],
			sideMenuTabsSelector: 'ul.left_panel li'
		}) );
	}
};

PageSlide5Controller.prototype._onClick = function(e) {
	var target = e.target;
	if (!target) return;

	var actionElement = target.closest('[data-action][data-target-id]');
	if (!actionElement) return;

	var action = actionElement.dataset.action;
	var targetId = actionElement.dataset.targetId;
	if (!action || !targetId) return;

	if (action === 'show-conf-block' && this._showConfigurationBlock(targetId)) {
		e.preventDefault();
		this._preview.hide();
	}
};

PageSlide5Controller.prototype._showConfigurationBlock = function(targetBlockId) {
	var blockFound = false;

	for (var i = 0, block; i < this._configurationBlocksArr.length; i++) {
		block = this._configurationBlocksArr[i];
		if (!blockFound && block.getId() === targetBlockId) {
			block.show();
			blockFound = true;
		} else {
			block.hide();
		}
	}

	return blockFound;
};

try {
	module.exports = PageSlide5Controller;
} catch (err) {
	console.warn(err);
}
