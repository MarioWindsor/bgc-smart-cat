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

	onValue(varInDB, function(snapshot) {
		const varDataArray = Object.values(snapshot.val());

		const fuseOptions = {
			findAllMatches: true,
			distance: 600,
			useExtendedSearch: true,
			minMatchCharLength: 2,
			threshold: 0.3,
			keys: [
				'variation_name', 
				// 'brand'
			]
		};

		const fuse = new Fuse(varDataArray, fuseOptions);

		// Search
		const searchQuery = "ASH";
		// const searchResult = Object.values(fuse.search(searchQuery));
		const searchResult = fuse.search(searchQuery);
		const resultArray = Object.values(searchResult);

		console.log("Searching for: " + searchQuery);
		console.log("Fuse Result: " + searchResult);

	});



	// const varInDB = ref(database, "data");

	// console.log(app);
	// console.log(database);
	// console.log(varInDB);

	/*onValue(varInDB, function(snapshot) {
		if (snapshot.exists()) {

			let varListArray = Object.entries(snapshot.val());
			// console.log(varListArray);
			// console.log(varListArray[2][1].variation_name);
			

			for (let i = 0; i < 10; i++) {
				let currentObj = varListArray[i];
				let currentItem = currentObj[1];
				console.log(currentObj);
				// console.log(currentItem);
				// console.log(currentItem.variation_name + " | " + currentItem.brand);
			}

			const fuseOptions = {
				findAllMatches: true,
				distance: 600,
				useExtendedSearch: true,
				minMatchCharLength: 2,
				threshold: 0.3,
				keys: [
					'variation_name', 
					'brand'
				]
			};

			const fuse = new Fuse(varListArray, fuseOptions);

			// Change the pattern
			const searchPattern = "PLATE";

			console.log("Searching for: " + searchPattern);
			console.log(fuse.search(searchPattern));

		} else {
			varList.innerHTML = "No items here... yet";
		}
	});*/

});
