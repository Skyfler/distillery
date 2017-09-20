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
	var PageSlide3Controller = require('./pageSlide3Controller');
	var PageSlide4Controller = require('./pageSlide4Controller');
	var PageSlide5Controller = require('./pageSlide5Controller');

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

	var slide3SvgElem = document.querySelector('#slide3 .svg_lines');
	if (slide3SvgElem) {
		var pageSlide3Controller = new PageSlide3Controller({
			elem: slide3SvgElem,
			colLeft: document.querySelector('#slide3 .col_left'),
			labelElemsDataArr: [
				{
					elem: slide3SvgElem.querySelector('.label1'),
					corner: {
						xs: 'bottom-right',
						sm: 'bottom-right',
						md: 'bottom-left',
						lg: 'bottom-left'
					},
					imagePercentCoords: {
						xs: {
							x: 73.1,
							y: 9.3
						},
						sm: {
							x: 73.1,
							y: 9.3
						},
						md: {
							x: 82.8,
							y: 32
						},
						lg: {
							x: 82.8,
							y: 32
						}
					},
				},
				{
					elem: slide3SvgElem.querySelector('.label2'),
					corner: {
						xs: 'bottom-right',
						sm: 'bottom-right',
						md: 'bottom-right',
						lg: 'bottom-right'
					},
					imagePercentCoords: {
						xs: {
							x: 24.7,
							y: 33.8
						},
						sm: {
							x: 24.7,
							y: 33.8
						},
						md: {
							x: 24.7,
							y: 33.8
						},
						lg: {
							x: 24.7,
							y: 33.8
						}
					},
				},
				{
					elem: slide3SvgElem.querySelector('.label3'),
					corner: {
						xs: 'top-left',
						sm: 'top-left',
						md: 'top-left',
						lg: 'top-left'
					},
					imagePercentCoords: {
						xs: {
							x: 62.9,
							y: 47.5
						},
						sm: {
							x: 62.9,
							y: 47.5
						},
						md: {
							x: 62.9,
							y: 47.5
						},
						lg: {
							x: 62.9,
							y: 47.5
						}
					},
				},
				{
					elem: slide3SvgElem.querySelector('.label4'),
					corner: {
						xs: 'top-right',
						sm: 'top-right',
						md: 'top-right',
						lg: 'top-right'
					},
					imagePercentCoords: {
						xs: {
							x: 22.8,
							y: 69.9
						},
						sm: {
							x: 22.8,
							y: 69.9
						},
						md: {
							x: 22.8,
							y: 69.9
						},
						lg: {
							x: 22.8,
							y: 69.9
						}
					},
				}
			]
		});
	}

	var slide4Elem = document.querySelector('#slide4');
	if (slide4Elem) {
		var pageSlide4Controller = new PageSlide4Controller({
			elem: slide4Elem,
			pageSlidesSliderActive: 'slide4'
		});
	}

	var slide5Elem = document.querySelector('#slide5');
	if (slide5Elem) {
		var pageSlide5Controller = new PageSlide5Controller({
			elem: slide5Elem,
			configurationBlockSelector: '.configuration_block',
			previewBlockSelector: '.preview_container'
		});
	}

})();
