/*
 *
 *	Carousel
 *
 */

/* -- Scroll Controls -- */

document.addEventListener("DOMContentLoaded", function() {
	console.log("Carousel Ready")
	const scollButtons = document.querySelectorAll('.scroll-button');
	scollButtons.forEach((scrollButton) => {
		scrollButton.addEventListener('click', (e) => {

			var dir = scrollButton.getAttribute('data-dir');
			var car = scrollButton.closest( ".carousel" );
			var carList = car.querySelector( ".carousel-list" );

			var scrOffsetPX = window.getComputedStyle(document.documentElement).getPropertyValue('--container-width');
			var scrOffset = parseInt(scrOffsetPX) * 0.8;

			carList.style.scrollBehavior = "smooth";

			if ( dir == "left") {
				carList.scrollLeft -= scrOffset;
			} else if ( dir == "right") {
				carList.scrollLeft += scrOffset;
			}
			
		});
	});

});

