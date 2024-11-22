
/*
 *
 * This handles the interaction of the arrow buttons on either side of the
 * 	carousel.
 *
 */
$( document ).on( "click", ".js_carousel_container .js_pager", function ( event ) {

	/*
	 * 1. Get references to all the relevant elements
	 */
	var $carouselArrowButton = $( event.target ).closest( ".js_pager" );
	var domCarouselContent = $carouselArrowButton
				.closest( ".js_carousel_container" )
				.find( ".js_carousel_content" )
				.get( 0 );

	/*
	 * 2. Figure out the "current" carousel item, i.e. the one that's in the center
	 */
	// var { top, left, width, height } = domCarouselContent.getBoundingClientRect();
	// var contentXMidpoint = left + width / 2;
	// var contentYMidpoint = top + height / 2;
	// var domCurrentItem = document.elementFromPoint( contentXMidpoint, contentYMidpoint );
	// var $currentItem;
	// if ( domCurrentItem )
	// 	$currentItem = $( domCurrentItem ).closest( ".js_carousel_item" );

	/*
	 * 3. Get the "next" carousel item in the sequence
	 * 	This could be either the preceeding or the following item,
	 * 	depending on the arrow's direction.
	 */
	// var $nextItem;
	var scrollDirection = $carouselArrowButton.data( "dir" );
	// if ( scrollDirection == "left" )
	// 	$nextItem = $currentItem.prev( ".js_carousel_item" );
	// else
	// 	$nextItem = $currentItem.next( ".js_carousel_item" );

	/*
	 * 4. Get the amount of scroll that has to be done to center the next item
	 */
	// var scrollOffset;
	// if ( $nextItem.length )
	// 	scrollOffset = ( $nextItem.get( 0 ).offsetLeft + $nextItem.innerWidth() / 2 )
	// 					- ( width / 2 );
	// else	// there is no "next" item because the current one is at the boundary
	// 	return;

	var scrollOffset = domCarouselContent.scrollLeft;
	var $carouselItem = $( domCarouselContent ).find( ".js_carousel_item" );
	if ( scrollDirection == "left" )
		scrollOffset -= $carouselItem.width();
	else
		scrollOffset += $carouselItem.width();

	/*
	 * 5. Finally, scroll the carousel.
	 */
	try {
		domCarouselContent.scrollTo( { left: scrollOffset, behavior: "smooth" } );
	}
	catch ( e ) {
		domCarouselContent.scrollTo( scrollOffset, 0 );
	}

} );