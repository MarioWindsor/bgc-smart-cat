/*
 *	Inserting Data Into Firebase DB
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
// import { add } from "../js/functions.js"

document.addEventListener("DOMContentLoaded", function() {
	// console.log(add(2,3));

	const appSettings = {
		databaseURL: "https://bgc-smart-cat-default-rtdb.asia-southeast1.firebasedatabase.app/"
	};

	const app = initializeApp(appSettings);
	const database = getDatabase(app);
	// const varInDB = ref(database, "data/variations");
	const varInDB = ref(database, "data");

	// console.log(app);

	/*
	 *	Search	
	 */

	const searchInput = document.getElementById("search-input");
	const searchButton = document.getElementById("search-button");

	searchButton.addEventListener("click", function() {
		let searchVal = searchInput.value;
		console.log(searchVal);
		clearSearchInput();

	});

	function clearSearchInput() {
		searchInput.value = "";
	};

	const varList = document.getElementById("cat-var-list");

	onValue(varInDB, function(snapshot) {
		if (snapshot.exists()) {

			let varListArray = Object.entries(snapshot.val());
			// console.log(varListArray[2][1].variation_name);

			// clearVarList();
			console.log(varListArray.length + ": total variations!")
			
			// for (let i = 0; i < varListArray.length; i++) {
			/*for (let i = 0; i < 100; i++) {
				let currentItem = varListArray[i];
				let currentItemName = varListArray[i][1].variation_name;
				console.log(currentItemName);
				// appendItemToVarList(currentItemName);
			}*/

		} else {
			varList.innerHTML = "No items here... yet";
		}
	});

	function clearVarList() {
		varList.innerHTML = "";
	};

	function appendItemToVarList(item) {
		varList.innerHTML += `<li>${item}</li>`;
	};



	fetch(varInDB)
		.then(response => response.json())
	    .then(data => {
	        const options = {
	        	// includeScore: true,
	        	// ignoreLocation: true,
	        	// ignoreFieldNorm: true,
	        	findAllMatches: true,
	        	distance: 600,
	        	useExtendedSearch: true,
	        	minMatchCharLength: 2,
	        	threshold: 0.3, /* A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything. */
	            // keys: ['variation_name', 'brand', 'attributes', 'attr_value']
	            keys: ['variation_name', 'brand', "attributes.attr_value"]
	        };
	        const fuse = new Fuse(data, options);

	        const searchInput = document.getElementById('searchInput');
	        const productList = document.getElementById('productList');

	        // const displayProducts = (products) => {
	        //     productList.innerHTML = ''; 
	        //     products.forEach(product => {
	        //         const listItem = document.createElement('li');
	        //         listItem.textContent = product.variation_name+' | '+product.brand;
	        //         productList.appendChild(listItem);
	        //     });
	        // };

	        // Initially display all products
	        // displayProducts(data); 

	        const logProducts = (products) => {
	            // productList.innerHTML = ''; 
	            console.clear()
	            products.forEach(product => {
	                // const listItem = document.createElement('li');
	                // listItem.textContent = product.variation_name+' | '+product.brand;
	                // productList.appendChild(listItem);
	                console.log(product.variation_name)
	            });
	        };

	        searchInput.addEventListener('input', () => {
	            const searchTerm = searchInput.value.toLowerCase();
	            if (searchTerm.trim() === '') {
	                // If search input is empty, display all products
	                // displayProducts(data);
	                logProducts(data);
	            } else {
	                // Otherwise, filter and log relevant results
	                const results = fuse.search(searchTerm);
	                // displayProducts(results.map(result => result.item)); 
	                logProducts(results.map(result => result.item)); 
	            }
	        });
        });

	console.log("Ready to Fuse!");


});
