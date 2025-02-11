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
		 *	Search	
		 */

		searchButton.addEventListener("click", function() {
			let searchVal = searchInput.value;
			console.log(searchVal);
			clearSearchInput();
			clearVarList();
			searchFunction(searchVal);
		});

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

				  let variant = "[" + product.item.variation_number + "] | " +
				    product.item.variation_name + " | " +
				    product.item.brand + " | " +
				    product.item.parent_category;

				  console.log(variant);
				  appendItemToVarList(variant);
				};
			}
		}

		/* Update Serch List in DOM */

		function clearSearchInput() {
			searchInput.value = "";
		};

		function appendItemToVarList(item) {
			varList.innerHTML += `<li>${item}</li>`;
		};

		function clearVarList() {
			varList.innerHTML = "";
		};

	});

});
