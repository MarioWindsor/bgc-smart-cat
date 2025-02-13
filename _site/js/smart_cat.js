/*
 *	Smart Catalogue : Refactored
 */

// -- FUZE Fuzzy Search Library -->
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs';



// -- Categories DB -->
import allCatsDB from '../media/data/category_new.json' with { type: 'json' };
const allCatsData = Object.values(allCatsDB.data.category);
const fuseCatOptions = {
	findAllMatches: true,
	distance: 600,
	useExtendedSearch: true,
	minMatchCharLength: 2,
	threshold: 0.3,
	// Individually Weighted Keys :
	keys: [
		{ name: 'name', weight: 1 }
	]
};
const fuseCat = new Fuse(allCatsData, fuseCatOptions);



// -- Products DB -->
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, get, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
	databaseURL: "https://bgc-smart-cat-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const allProdsDB = ref(database, "data/variations");
let allProdsData;
const fuseProdOptions = {
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

	// -- Initialize DOM Elements -->
	const searchInput = document.getElementById("search-input");
	const searchClear = document.getElementById("search-clear");
	const searchLabel = document.getElementById("search-list-label");
	const searchCatList = document.getElementById("search-cat-list");
	const searchProdList = document.getElementById("search-prod-list");



	// -- Update DOM Elements Functions -->
	function clearSearchInput() {
		searchInput.value = "";
	};

	function clearSearchLabel() {
		searchLabel.innerHTML = "";
	};

	function clearSearchCatList() {
		searchCatList.innerHTML = "";
	};

	function appendItemToSearchCatList(item) {
		searchCatList.innerHTML += item;
	};

	function clearSearchProdList() {
		searchProdList.innerHTML = "";
	};

	function appendItemToSearchProdList(item) {
		searchProdList.innerHTML += item;
	};



	// -- X Out Search
	searchClear.addEventListener('click', function(){
		console.log("Clear Search");
		clearSearchInput();
		clearSearchLabel();
		clearSearchProdList();
	});



	// ~ ~ Wait for Firebase Connection ~ ~ //
	onValue(allProdsDB, function(snapshot) {
			const allProdsData = Object.values(snapshot.val());


						


			// -- Search Cats & Prods -->
			const fuseProd = new Fuse(allProdsData, fuseProdOptions);
			function searchCatsAndProds(inv) {
				let searchQuery = inv;

				// Get Result Array (with a max limit) for better performance
				const catResult = Object.values(fuseCat.search(searchQuery, {limit: 20}));
				console.log("Cats :", catResult);

				// Get Result Array (with a max limit) for better performance
				const prodResult = Object.values(fuseProd.search(searchQuery, {limit: 20}));
				console.log("Prods :", prodResult);

				if ( catResult.length == 0 && prodResult.length == 0 ) {
					searchLabel.innerHTML = "No Results for... "+ searchQuery;
				} else {
					searchLabel.innerHTML = "Results for... "+ searchQuery;

					// -- Output For Cat Array -->
					for (let k = 0; k < catResult.length; k++) {
						const category = catResult[k]; // Access the current category
						let itemName = category.item.name;
						console.log (itemName);
						let resultItem = `<li class="pill">
							<div class="small text-blue-dark fill-blue-light radius-25">${itemName}</div>
						</li>`;

						// -- Update Cat List
						appendItemToSearchCatList(resultItem);
					}


					// -- Output For Prods Array -->
					for (let i = 0; i < prodResult.length; i++) {
						const product = prodResult[i]; // Access the current product

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

						// -- Update Prod List
						appendItemToSearchProdList(resultItem);
					}
				}
			}



			
			// -- Search Input Function -->
			function searchInputChange(event) {
				// Perform your desired action here, e.g., fetching data, updating display, etc.
				let searchVal = searchInput.value;

				if ( searchVal.length == 0 ) {
					clearSearchLabel();
					clearSearchCatList();
					clearSearchProdList();
				} else {
					clearSearchLabel();
					clearSearchCatList();
					clearSearchProdList();
					searchCatsAndProds(searchVal);
				}

			}
			
			// -- Debounce Search Input Function -->
			const debouncedInputChangeHandler = debounce(searchInputChange, 850); // 1000ms delay

			// -- Search Input Event Listener -->
			searchInput.addEventListener('input', debouncedInputChangeHandler);
		
	});
});
