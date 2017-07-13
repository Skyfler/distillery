"use strict";

try {
	var Helper = require('./helper');
	var Animation = require('./animation');
} catch (err) {
	console.warn(err);
}

function SideMenu(options) {
	options.name = options.name || 'SideMenu';
	Helper.call(this, options);

	this._elem = options.elem;
	this._menuButton = options.menuButton;
	this._activeClass = options.activeClass || 'active';
	this._animationDuration = options.animationDuration || 500;

	this._onPageSlideChanged = this._onPageSlideChanged.bind(this);
	this._onPageSlideChangedDropdownActive = this._onPageSlideChangedDropdownActive.bind(this);
	this._onResize = this._onResize.bind(this);
	this._onMenuBtnClick = this._onMenuBtnClick.bind(this);

	this._init();
}

SideMenu.prototype = Object.create(Helper.prototype);
SideMenu.prototype.constructor = SideMenu;

SideMenu.prototype._init = function() {
	this._listItemsArr = this._elem.querySelectorAll('.side_menu_list_item');
	this._listItemsCount = this._listItemsArr.length;
	this._overflowContainer = this._elem.querySelector('.side_menu_container');
	this._dropdownState = 'inactive';

	if (['xs', 'sm'].indexOf(this._checkScreenWidth() !== -1)) {
		this._initDropdownOnMobile();
	}

	this._controllLineHeight();

	this._addListener(document, 'pageSlideChanged', this._onPageSlideChanged);
	this._addListener(window, 'resize', this._onResize);
};

SideMenu.prototype._onPageSlideChanged = function(e) {
	var activeSlideID = e.detail.activeSlideID,
		activeSlideElem = e.detail.activeSlideElem;

	for (var i = 0, newActiveListItem; i < this._listItemsCount && !newActiveListItem; i++) {
		if (this._listItemsArr[i].dataset.slide === activeSlideID && this._listItemsArr[i] !== this._activeListItem) {
			newActiveListItem = this._listItemsArr[i];
		}
	}

	if (activeSlideElem && !newActiveListItem) {
		var activeParentSlideElemId = activeSlideElem.id;

		if (!activeParentSlideElemId) return;

		for (var i = 0, newActiveListItem; i < this._listItemsCount && !newActiveListItem; i++) {
			if (this._listItemsArr[i].dataset.slide === activeParentSlideElemId && this._listItemsArr[i] !== this._activeListItem) {
				newActiveListItem = this._listItemsArr[i];
			}
		}
	}

	if (newActiveListItem) {
		this._setActiveListItem(newActiveListItem);
	}
};

SideMenu.prototype._initDropdownOnMobile = function() {
	this._overflowContainer.style.height = 0;
	this._menuButton.classList.remove(this._activeClass);
	this._addListener(this._menuButton, 'click', this._onMenuBtnClick);
	this._addListener(document, 'pageSlideChanged', this._onPageSlideChangedDropdownActive);
	this._dropdownState = 'closed';
};

SideMenu.prototype._cancelDropdownOnMobile = function() {
	this._overflowContainer.style.height = '';
	this._menuButton.classList.remove(this._activeClass);
	this._removeListener(this._menuButton, 'click', this._onMenuBtnClick);
	this._removeListener(document, 'pageSlideChanged', this._onPageSlideChangedDropdownActive);
	this._dropdownState = 'inactive';

	if (this._dropdownAnimation) {
		this._dropdownAnimation.stop();
		delete this._dropdownAnimation;
	}
};

SideMenu.prototype._onMenuBtnClick = function(e) {
	this._toggleMenu();
};

SideMenu.prototype._toggleMenu = function() {
	if (this._dropdownState === 'closed') {
		this._openMenu();
	} else if (this._dropdownState === 'open') {
		this._closeMenu();
	}
};

SideMenu.prototype._onPageSlideChangedDropdownActive = function() {
	if (this._dropdownState === 'open') {
		this._closeMenu();
	}
};

SideMenu.prototype._openMenu = function() {
	this._dropdownState = 'open';

	if (this._dropdownAnimation) {
		this._dropdownAnimation.stop();
		delete this._dropdownAnimation;
	}

	this._menuButton.classList.add(this._activeClass);

	this._animationData = {
		start: this._overflowContainer.offsetHeight,
		end: this._overflowContainer.querySelector('.side_menu_list').offsetHeight
	};

	this._dropdownAnimation = new Animation(
		this._dropdownDraw.bind(this),
		this._animationDuration,
		function(){
			delete this._dropdownAnimation;
			delete this._animationData;
		}.bind(this)
	);
};

SideMenu.prototype._closeMenu = function() {
	this._dropdownState = 'closed';

	if (this._dropdownAnimation) {
		this._dropdownAnimation.stop();
		delete this._dropdownAnimation;
	}

	this._menuButton.classList.remove(this._activeClass);

	this._animationData = {
		start: this._overflowContainer.offsetHeight,
		end: 0
	};

	this._dropdownAnimation = new Animation(
		this._dropdownDraw.bind(this),
		this._animationDuration,
		function(){
			delete this._dropdownAnimation;
			delete this._animationData;
		}.bind(this)
	);
};

SideMenu.prototype._dropdownDraw = function(timePassed) {
	var timeMuliplier = Animation.quadEaseInOut(this._animationDuration, timePassed);
	var height = this._animationData.start + (this._animationData.end - this._animationData.start) * timeMuliplier;

	this._overflowContainer.style.height = height + 'px';
};

SideMenu.prototype._controllLineHeight = function() {
	var prevElem, line, height;
	for (var i = 0; i < this._listItemsCount; i++) {
		line = this._listItemsArr[i].querySelector('.line');
		prevElem = this._listItemsArr[i - 1] ? this._listItemsArr[i - 1] : this._menuButton;
		height = this._calculateLineHeight(this._listItemsArr[i], prevElem);
		line.style.height = (height > 0 ? height : 0) + 'px';
	}
};

SideMenu.prototype._calculateLineHeight = function(elem, prevElem) {
	var elemRect = elem.getBoundingClientRect();
	var prevElemRect = prevElem.getBoundingClientRect();

	var diff = elemRect.top - prevElemRect.bottom - 20;

	return diff;
};

SideMenu.prototype._setActiveListItem = function(activeListItem) {
	if (this._activeListItem) {
		this._activeListItem.classList.remove('active');
	}
	activeListItem.classList.add('active');
	this._activeListItem = activeListItem;

//	if (this._checkScreenWidth() === 'xs' || this._checkScreenWidth() === 'sm'  || this._checkScreenWidth() === 'md') return;
};

SideMenu.prototype._onResize = function() {
//	if (this._checkScreenWidth() === 'xs' || this._checkScreenWidth() === 'sm'  || this._checkScreenWidth() === 'md') return;

	if (!this._activeListItem) {
		this._setActiveListItem(this._listItemsArr[0]);
	}

	if (['xs', 'sm'].indexOf(this._checkScreenWidth()) !== -1 && this._dropdownState === 'inactive') {
		this._initDropdownOnMobile();
	} else if (['xs', 'sm'].indexOf(this._checkScreenWidth()) === -1 && this._dropdownState !== 'inactive') {
		this._cancelDropdownOnMobile();
	} else if (this._dropdownState === 'open') {
		this._toggleMenu();
	}

	this._controllLineHeight();
};

try {
	module.exports = SideMenu;
} catch (err) {
	console.warn(err);
}
