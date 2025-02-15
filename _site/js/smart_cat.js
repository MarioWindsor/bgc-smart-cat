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
	const catList = document.getElementById("cat-list");
	const prodList = document.getElementById("prod-list");
	const catHome = document.getElementById("cat-home");



	// -- Update DOM Elements Functions -->
	function clearSearchInput() {
		searchInput.value = "";
	};

	function clearSearchLabel() {
		searchLabel.innerHTML = "";
	};

	function clearCatList() {
		catList.innerHTML = "";
	};

	function appendItemToCatList(item) {
		catList.innerHTML += item;
	};

	function clearProdList() {
		prodList.innerHTML = "";
	};

	function appendItemToProdList(item) {
		prodList.innerHTML += item;
	};



	// -- X Out Search
	searchClear.addEventListener('click', function(){
		// console.log("Clear Search");
		clearSearchInput();
		clearSearchLabel();
		clearCatList();
		clearProdList();
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
			// console.log("Cats :", catResult);

			// Get Result Array (with a max limit) for better performance
			const prodResult = Object.values(fuseProd.search(searchQuery, {limit: 20}));
			// console.log("Prods :", prodResult);

			if ( catResult.length == 0 && prodResult.length == 0 ) {
				searchLabel.innerHTML = "No Results for... "+ searchQuery;
			} else {
				searchLabel.innerHTML = "Results for... "+ searchQuery;

				// -- Output For Cat Array -->
				for (let k = 0; k < catResult.length; k++) {
					const category = catResult[k]; // Access the current category
					let itemName = category.item.name;
					let itemCatID = category.item.catid;
					// console.log(itemName);
					let resultItem = `<li class="pill label box-shadow-blue" tabindex="0" data-catid="${itemCatID}" data-name="${itemName}">${itemName}</li>`;

					// -- Update Cat List
					appendItemToCatList(resultItem);
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
						<button class="add-item button fill-blue box-shadow-blue block" data-id="${itemNumber}" data-name="${itemNameSpaced}" style="padding: 0; text-align: center;"><i class='h5 bx bx-plus' style="line-height: inherit;"></i></button>
					</li>`;

					// -- Update Prod List
					appendItemToProdList(resultItem);
				}
			}
		}


		
		// -- Search Input Function -->
		function searchInputChange(event) {
			// Perform your desired action here, e.g., fetching data, updating display, etc.
			let searchVal = searchInput.value;

			if ( searchVal.length == 0 ) {
				clearSearchLabel();
				clearCatList();
				clearProdList();
			} else {
				clearSearchLabel();
				clearCatList();
				clearProdList();
				searchCatsAndProds(searchVal);
			}

		}
		
		// -- Debounce Search Input Function -->
		const debouncedInputChangeHandler = debounce(searchInputChange, 850); // 1000ms delay

		// -- Search Input Event Listener -->
		searchInput.addEventListener('input', debouncedInputChangeHandler);




		// -- Cat Pill Event Listener
		catList.addEventListener('click', function(){
			const activeCat = event.target.closest('li.pill'); // Find the closest li.pill

			if (activeCat) { // Check if an li.pill was clicked
				const activeCatID = activeCat.dataset.catid;
				const activeCatName = activeCat.dataset.name;

				clearSearchInput();
				clearSearchLabel();
				clearCatList();
				clearProdList();

				// console.log("Active Category ID:", activeCatID);

				activeCatList(activeCatID, activeCatName);
			}
		});

		function activeCatList(activeCatID, activeCatName) {
			// console.log(catId,":",catName);
			searchLabel.innerHTML = "Browse by... " + activeCatName;

			// -- List Sub Cats
			for (let i = allCatsData.length - 1; i >= 0; i--) {
				const subCat = allCatsData[i];
				if ( activeCatID == subCat.main_parent && activeCatID != subCat.catid ) {
					let subCatID = subCat.catid;
					let subCatName = subCat.name;
					// console.log(subCatName);
					let resultCat = `<li class="pill label box-shadow-blue" tabindex="0" data-catid="${subCatID}" data-name="${subCatName}">${subCatName}</li>`;

					// -- Update Cat List
					appendItemToCatList(resultCat);
				}
			}

			// -- List Prods in Sub Cats
			// console.log(allProdsData.length);
			// console.log(activeCatID);
			for (let l = 0; l < allProdsData.length; l++) {
				// let prodSubCat = Object.values(allProdsData[l]);
				let prodSubCat = allProdsData[l];
				// console.log(prodSubCat.variation_name);
				// console.log(l);

				if ( activeCatID == prodSubCat.category_id) {
					// console.log(prodSubCat.variation_name);

					let itemNumber = prodSubCat.variation_number;
					let itemName = prodSubCat.variation_name;
					let itemNameSpaced = itemName.replace(/\./g, " ");
					let itemImage = prodSubCat.image;
					let itemBrand = prodSubCat.brand;
					let itemCat = prodSubCat.category;
					let itemCatID = prodSubCat.category_id;
					let itemMainCat = prodSubCat.main_category;
					let itemMainCatID = prodSubCat.main_category_id;
					let itemAttr = Object.values(prodSubCat.attributes || {});

					let prodSubCatList = `<li class="item">
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
						<button class="add-item button fill-blue box-shadow-blue block" data-id="${itemNumber}" data-name="${itemNameSpaced}" style="padding: 0; text-align: center;"><i class='h5 bx bx-plus' style="line-height: inherit;"></i></button>
					</li>`;

					// -- Update Prod List
					appendItemToProdList(prodSubCatList);
				}
			}
		}
	});




	// -- Cat Home Function -->
	function catHomeCatList() {
		// console.log("Main Categories List");
		searchLabel.innerHTML = "Browse by Category : [ All ]";

		// -- List Main Cats
		for (let i = 0; i < allCatsData.length; i++) {
			const mainCat = allCatsData[i];
			if ( mainCat.catid == mainCat.main_parent) {
				let mainCatID = mainCat.catid;
				let mainCatName = mainCat.name;
				// console.log(mainCatName);
				let resultCat = `<li class="pill label box-shadow-blue" tabindex="0" data-catid="${mainCatID}" data-name="${mainCatName}">${mainCatName}</li>`;

				// -- Update Cat List
				appendItemToCatList(resultCat);
			}
		}
	}

	// -- Cat Home Event Listener -->
	catHome.addEventListener('click', function(){
		// console.log("Home");
		clearSearchInput();
		clearSearchLabel();
		clearCatList();
		clearProdList();

		catHomeCatList();
	});




	// -- Add to Cart Functionality -->
	
	const cartList = document.getElementById("cart-list");
	let allCartItems = []; // Array to store selected product objects

	// Detect Add to Cart
	prodList.addEventListener('click', function(){
		const activeProd = event.target.closest('li.item .add-item'); // Find the closest add-item button
		
		if (activeProd) { // Check if an add-item was clicked
			const activeProdID = activeProd.dataset.id;
			const activeProdName = activeProd.dataset.name;

			// Check if the product is already in the array (to avoid duplicates on single clicks)
			const productExists = allCartItems.some(product => product.id === activeProdID);

			if (!productExists) {
				const productObject = {
					id: activeProdID,
					name: activeProdName
				};
				allCartItems.push(productObject);
				cartList.innerHTML = ""; // Clear Cart List
				updateCart(); // Update Cart List
			}
		}
	});

	// Update Cart
	function updateCart() {
		if (allCartItems.length != 0) {
			for (let i = 0; i < allCartItems.length; i++) {
				const cartItemID = allCartItems[i].id
				const cartItemName = allCartItems[i].name
				const cartItem =  `<li class="cart-item" data-id="${cartItemID}"><span>
				<div class="small inline">ID: ${cartItemID}</div><div class="name label strong font-h">${cartItemName}</div></span></li>`;
				appendCart(cartItem);
			}
		}
	}

	// Append Items to Cart List
	function appendCart(item) {
		cartList.innerHTML += item;
	};


	// -- Detect Remove From Cart -->
	cartList.addEventListener('click', function(){
		const activeCart = event.target.closest('li.cart-item'); // Find the closest add-item button
		
		if (activeCart) { // Check if an add-item was clicked
			const activeCartID = activeCart.dataset.id;

			// Remove from allCartItems array:
			allCartItems = allCartItems.filter(item => item.id !== activeCartID);

			// Update the displayed cart list:
			cartList.innerHTML = ""; // Clear the cart list
			updateCart();           // Re-render the cart with the updated items

			console.log(activeCartID);
		}
	});

});
