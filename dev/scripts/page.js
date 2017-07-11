"use strict";

(function ready() {

	var _polyfills = require('./polyfills');
	var _extendStandartPrototypes = require('./extendStandartPrototypes');
	var ScrollScreenPage = require('./scrollScreenPage');
	var PageSlideNumbering = require('./pageSlideNumbering');
	var ScrollToSlide = require('./scrollToSlide');
	var ContactFormController = require('./contactFormController');
	var FirstSlideIntro = require('./firstSlideIntro');
	var SideMenu = require('./sideMenu');
	var Slider = require('./slider');

	_polyfills.init();
	_extendStandartPrototypes.init();

	var sideMenuElem = document.querySelector('.side_menu');
	if (sideMenuElem) {
		var sideMenu = new SideMenu({
			elem: sideMenuElem,
			menuButton: document.querySelector('.menu_button')
		});
	}

//	var scrollToSlide = new ScrollToSlide({
//		scrollDuration: 600
//	});

	var scrollScreenPageElem = document.querySelector('#page_scroller');
	if (scrollScreenPageElem) {
		var scrollScreenPage = new ScrollScreenPage({
			elem: scrollScreenPageElem,
			animationDuration: 1000,
			slidePartsBreakpoint: 1200,
			widthCancelModesArr: [],
			widthActiveModesArr: ['xs', 'sm', 'md', 'lg']
		});

//		var pageSlideNumbering = new PageSlideNumbering({
//			elem: scrollScreenPageElem
//		});
	}

	var introElem = document.querySelector('#intro');
	if (introElem) {
		var firstSlide = new FirstSlideIntro({
			elem: introElem,
//			intro1Elem: introElem.querySelector('.logo_2'),
			introElem1: introElem,
			introElem2: introElem.querySelector('.intro_logo_container'),
			introElem3: introElem.querySelector('.top'),
			introElem4: introElem.querySelector('.bottom'),
			introElem5: introElem.querySelector('.hidden_logo_container'),
			logoElems: [
				introElem.querySelector('.logo_1'),
				introElem.querySelector('.logo_2'),
				introElem.querySelector('.logo_3'),
				introElem.querySelector('.logo_4')
			],
			scrollIcon: introElem.querySelector('.scroll_icon'),
			smallLogoUrls: [
				'img/logo_sm_part_1.png',
				'img/logo_sm_part_2.png',
				'img/logo_sm_part_3.png',
				'img/logo_sm_part_4.png'
			],
			animationDuration: 500
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

	var sliderElem = document.querySelector('#slider');
	if (sliderElem) {
		window.slider = new Slider({
			elem: sliderElem,
			delay: 0,
			controllsElem: document.querySelector('.slider_dot_controlls')
		});
	}

})();
