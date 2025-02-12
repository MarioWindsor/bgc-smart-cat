/*
 *	Inserting Data Into Firebase DB
 */

import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs'

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
// import { add } from "../js/functions.js"

document.addEventListener("DOMContentLoaded", function() {
	//console.log(Fuse);

	const appSettings = {
		databaseURL: "https://bgc-smart-cat-default-rtdb.asia-southeast1.firebasedatabase.app/"
	};

	const app = initializeApp(appSettings);
	const database = getDatabase(app);
	const varInDB = ref(database, "data/variations");

	const searchInput = document.getElementById("search-input");
	const searchButton = document.getElementById("search-button");
	const varList = document.getElementById("search-list");
	const searchLabel = document.getElementById("search-list-label");

	/* Inside Realtime Database Connection */

	onValue(varInDB, function(snapshot) {
		const varDataArray = Object.values(snapshot.val());

		const fuseOptions = {
			findAllMatches: true,
			distance: 600,
			useExtendedSearch: true,
			minMatchCharLength: 2,
			threshold: 0.3,
			// Individually Weighted Keys :
			keys: [
				{ name: 'variation_name', weight: 4 }, 
				{ name: 'brand', weight: 1 },
				{ name: 'attributes.attr_value', weight: 2 }
			]
		};

		const fuse = new Fuse(varDataArray, fuseOptions);

		/*
		 *	Search (with Debounce)
		 */

		// -- Define Debounce Function -->
		function debounce(func, delay) {
		  let timeoutId;

		  return function(...args) {
		    clearTimeout(timeoutId); // Clear previous timeout if any

		    timeoutId = setTimeout(() => {
		      func.apply(this, args); // Execute the function with correct context and arguments
		    }, delay);
		  };
		}

		// -- Search Input Function -->
		function searchInputChange(event) {
			// Perform your desired action here, e.g., fetching data, updating display, etc.
			let searchVal = searchInput.value;
			console.log(searchVal);
			// clearSearchInput();
			clearVarList();
			searchFunction(searchVal);
			// console.log('Input changed:', event.target.value);
		}

		// -- Debounce Search Input Function -->
		const debouncedInputChangeHandler = debounce(searchInputChange, 800); // 800ms delay

		// -- Search Input Event Listener -->
		searchInput.addEventListener('input', debouncedInputChangeHandler);

		/* -- End: Debounce Search -- */


		// -- FUSE : Fuzzy Search Function -->
		function searchFunction(query) {

			const searchQuery = query;

			let searchScope = "Looking for... "+ query;
			searchLabel.innerHTML = searchScope;

			// Get Result Array (with a max limit) for better performance
			const searchResult = Object.values(fuse.search(searchQuery, {limit: 20}));

			if ( searchResult.length == 0 ) {

				searchLabel.innerHTML = "No Results Found";

			} else {

				// Output Result Array
				for (let i = 0; i < searchResult.length; i++) {
					const product = searchResult[i]; // Access the current product

					let itemNumber = product.item.variation_number;
					let itemName = product.item.variation_name;
					let itemNameSpaced = itemName.replace(/\./g, " ");
					let itemImage = product.item.image;
					let itemBrand = product.item.brand;
					let itemCat = product.item.category;
					let itemCatID = product.item.category_id;
					let itemMainCat = product.item.main_category;
					let itemMainCatID = product.item.main_category_id;
					let itemAttr = Object.values(product.item.attributes);

					let resultItem = `<li class="item">
						<div class="thumbnail img-cover" style="background-image: url('https://bgc.sixorbit.com/${itemImage}')"></div>
						<div class="details label">
							<div class="small text-neutral-3">ID: ${itemNumber} | Brand : ${itemBrand}</div>
							<div class="name p font-h text-blue">${itemNameSpaced}</div>
							<div class="attr small text-neutral-6">
							${itemAttr.map(item => `<span>${item.attr_name} : ${item.attr_value}</span>`).join(" | ")}
							</div>
						</div>
						<button class="button fill-blue box-shadow-blue block" type="submit" style="padding: 0; text-align: center;"><i class='h5 bx bx-plus' style="line-height: inherit;"></i></button>
					</li>`;

					appendItemToVarList(resultItem);
				};
			}
		}

		/* Update Serch List in DOM */

		function clearSearchInput() {
			searchInput.value = "";
		};

		function appendItemToVarList(item) {
			varList.innerHTML += item;
		};

		function clearVarList() {
			varList.innerHTML = "";
		};

	});

});
