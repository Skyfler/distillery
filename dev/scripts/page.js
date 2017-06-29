"use strict";

(function ready() {

	var _polyfills = require('./polyfills');
	var _extendStandartPrototypes = require('./extendStandartPrototypes');
	var ScrollScreenPage = require('./scrollScreenPage');
	var PageSlideNumbering = require('./pageSlideNumbering');
	var ScrollToSlide = require('./scrollToSlide');
	var ContactFormController = require('./contactFormController');
	var FirstSlideIntro = require('./firstSlideIntro');

	_polyfills.init();
	_extendStandartPrototypes.init();

	var scrollToSlide = new ScrollToSlide({
		scrollDuration: 600
	});

	var scrollScreenPageElem = document.querySelector('#page_scroller');
	if (scrollScreenPageElem) {
		var scrollScreenPage = new ScrollScreenPage({
			elem: scrollScreenPageElem,
			animationDuration: 1000,
			slidePartsBreakpoint: 1200
		});

		var pageSlideNumbering = new PageSlideNumbering({
			elem: scrollScreenPageElem
		});
	}

	var introElem = document.querySelector('#intro');
	if (introElem) {
		var firstSlide = new FirstSlideIntro({
			elem: introElem,
			intro1Elem: introElem.querySelector('.logo_2'),
			intro2Elem1: introElem,
			intro2Elem2: introElem.querySelector('.intro_logo_container')
		});
	}

	var contactFormElem = document.querySelector('#contact_form');
	if (contactFormElem) {
		var contactForm = new ContactFormController({
			elem: contactFormElem,
			actionUrl: contactFormElem.action,
			succsessNotificationHTML: '<div class="success_notification">' +
				'<p>Ваша заявка принята!</p>' +
				'<p>Наши менеджеры свяжутся с вами в ближайшее время ;)</p>' +
				'</div>'
		});
	}

})();
