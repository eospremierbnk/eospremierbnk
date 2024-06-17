(function ($) {
	"use strict";
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 120) {
			$('.navbar-area').addClass("mt-dyno");
		} else {
			$('.navbar-area').removeClass("mt-dyno");
		}
	});
	jQuery('.mean-menu').meanmenu({
		meanScreenWidth: "991"
	});
	$('#main-slidess').owlCarousel({
		nav: true,
		loop: true,
		dots: false,
		autoplayHoverPause: true,
		animateOut: 'fadeOut',
		autoplayTimeout: 8000,
		animateIn: 'fadeIn',
		autoplay: true,
		items: 1,
		navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"]
	});
	//$('select').niceSelect();
	$('.odometer').appear(function (e) {
		var odo = $(".odometer");
		odo.each(function () {
			var countNumber = $(this).attr("data-count");
			$(this).html(countNumber);
		});
	});
	$('.popup-youtube').magnificPopup({
		disableOn: 320,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false
	});
	var $imagesSlider = $(".feedback-slides .client-feedback>div"),
		$thumbnailsSlider = $(".client-thumbnails>div");
	$imagesSlider.slick({
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1,
		cssEase: 'linear',
		fade: true,
		autoplay: true,
		draggable: true,
		asNavFor: ".client-thumbnails>div",
		prevArrow: '.client-feedback .prev-arrow',
		nextArrow: '.client-feedback .next-arrow'
	});
	$thumbnailsSlider.slick({
		speed: 300,
		slidesToShow: 5,
		slidesToScroll: 1,
		cssEase: 'linear',
		autoplay: true,
		centerMode: true,
		draggable: false,
		focusOnSelect: true,
		asNavFor: ".feedback-slides .client-feedback>div",
		prevArrow: '.client-thumbnails .prev-arrow',
		nextArrow: '.client-thumbnails .next-arrow',
	});
	var $caption = $('.feedback-slides .caption');
	var captionText = $('.client-feedback .slick-current img').attr('alt');
	updateCaption(captionText);
	$imagesSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
		$caption.addClass('hide');
	});
	$imagesSlider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
		captionText = $('.client-feedback .slick-current img').attr('alt');
		updateCaption(captionText);
	});

	function updateCaption(text) {
		if (text === '') {
			text = ' ';
		}
		$caption.html(text);
		$caption.removeClass('hide');
	}
	$(function () {
		$('.accordion').find('.accordion-title').on('click', function () {
			$(this).toggleClass('active');
			$(this).next().slideToggle('fast');
			$('.accordion-content').not($(this).next()).slideUp('fast');
			$('.accordion-title').not($(this)).removeClass('active');
		});
	});
	$(function () {
		$(window).on('scroll', function () {
			var scrolled = $(window).scrollTop();
			if (scrolled > 600) $('.go-top').addClass('active');
			if (scrolled < 600) $('.go-top').removeClass('active');
		});
		$('.go-top').on('click', function () {
			$("html, body").animate({
				scrollTop: "0"
			}, 500);
		});
	});
	$('.success-story-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		items: 1,
		margin: 5,
		navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"]
	});
	$('.partner-slides').owlCarousel({
		loop: true,
		nav: false,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"],
		responsive: {
			0: {
				items: 2,
			},
			576: {
				items: 3,
			},
			768: {
				items: 4,
			},
			992: {
				items: 5,
			}
		}
	});
	$(window).on('load', function () {
		if ($(".wow").length) {
			var wow = new WOW({
				boxClass: 'wow',
				animateClass: 'animated',
				offset: 20,
				mobile: true,
				live: true,
			});
			wow.init();
		}
	});
	jQuery(window).on('load', function () {
		$('.preloader').fadeOut();
	});
}(jQuery));