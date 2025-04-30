/*
 *	Smart Catalogue
 */

// -- FUZE Fuzzy Search Library -->
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs'

// -- Firebase DB -->
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// -- Categories DB -->
import allCatsDB from '../media/data/category_new.json' with { type: 'json' };





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





document.addEventListener("DOMContentLoaded", function() {

	// -- Firebase Data -->
	const appSettings = {
		databaseURL: "https://bgc-smart-cat-default-rtdb.asia-southeast1.firebasedatabase.app/"
	};
	const app = initializeApp(appSettings);
	const database = getDatabase(app);
	const varInDB = ref(database, "data/variations");

	// -- Categories Data -->
	const allCats = Object.values(allCatsDB.data.category);

	// -- DOM Elements -->
	const searchInput = document.getElementById("search-input");
	const searchButton = document.getElementById("search-button");
	const varList = document.getElementById("search-list");
	const searchLabel = document.getElementById("search-list-label");
	const searchClear = document.getElementById("search-clear");

	/* Update DOM Elements Functions */
	function clearSearchInput() {
		searchInput.value = "";
	};

	function clearSearchLabel() {
		searchLabel.innerHTML = "";
	};

	function clearVarList() {
		varList.innerHTML = "";
	};

	function appendItemToVarList(item) {
		varList.innerHTML += item;
	};


	// -- X Out Search
	searchClear.addEventListener('click', function(){
		console.log("clear");
		clearSearchInput();
		clearSearchLabel();
		clearVarList();
	});




	// -- Inside Firebase DB Connection -->
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
				{ name: 'variation_number', weight: 3 },
				{ name: 'attributes.attr_value', weight: 2 },
				{ name: 'brand', weight: 1 },
			]
		};

		const fuse = new Fuse(varDataArray, fuseOptions);

		/*
		 *	Search Firebase DB (with Debounce)
		 */

		// -- Search Input Function -->
		function searchInputChange(event) {
			// Perform your desired action here, e.g., fetching data, updating display, etc.
			let searchVal = searchInput.value;
			// console.log(searchVal);
			console.log(event);
			// clearSearchInput();
			clearVarList();
			searchFunction(searchVal);
		}

		// -- Debounce Search Input Function -->
		const debouncedInputChangeHandler = debounce(searchInputChange, 800); // 800ms delay
		// -- Search Input Event Listener -->
		searchInput.addEventListener('input', debouncedInputChangeHandler);

		/* -- End: Debounce Search -- */


		// -- FUSE : Fuzzy Search Function -->
		function searchFunction(query) {

			const searchQuery = query;

			if ( searchQuery.length == 0 ) {
				// Search is Empty 
				searchLabel.innerHTML = "";

			} else {

				// Searching for ...
				let searchScope = "Results for... "+ query;
				searchLabel.innerHTML = searchScope;

				// Get Result Array (with a max limit) for better performance
				const searchResult = Object.values(fuse.search(searchQuery, {limit: 20}));

				if ( searchResult.length == 0 ) {

					searchLabel.innerHTML = "No Results for... "+ query;

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
						let itemAttr = Object.values(product.item.attributes || {});

						let resultItem = `<li class="item">
							<div class="thumbnail img-cover" style="background-image: url('https://bgc.sixorbit.com/${itemImage}')"></div>
							<div class="details label">
								<div class="small text-neutral-3">ID: ${itemNumber} | Brand : ${itemBrand}</div>
								<div class="name p font-h text-blue">${itemNameSpaced}</div>
								<div class="attr small text-neutral-6">
								${itemAttr
								  .filter(item => item.attr_value.length > 0)
								  .map(item => `<span>${item.attr_name} : ${item.attr_value}</span>`)
								  .join(" | ")}
								</div>
							</div>
							<button class="button fill-blue box-shadow-blue block" type="submit" style="padding: 0; text-align: center;"><i class='h5 bx bx-plus' style="line-height: inherit;"></i></button>
						</li>`;

						// -- Update Item List
						appendItemToVarList(resultItem);
					};
				}
			}
		}
	});








});
