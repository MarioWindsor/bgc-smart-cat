/*
 *	Smart Catalogue : Refactored
 */

// -- FUZE Fuzzy Search Library -->
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs';

// --- GLOBAL VARIABLES FOR DATA ---
// Declare these at the top level of your script, accessible everywhere.
let allCatsData = [];
let allProdsData = []; // Initialize as empty array as well, for consistency
let fuseCat; // Declare globally, initialize later
let fuseProd; // Declare globally, initialize later


// -- Categories DB Fetch (ASYNCHRONOUS) -->
// This promise will handle fetching your categories data.
const fetchCategoriesPromise = fetch('../media/uploads/categories.json')
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		// Assign to the GLOBAL allCatsData
		allCatsData = Object.values(data.data.category);
		console.log("Categories data fetched and assigned:", allCatsData.length, "items");
		return allCatsData; // Return the data to the promise chain
	})
	.catch(error => {
		console.error('Error fetching Categories JSON:', error);
		return []; // Return empty array on error, so Promise.all can still proceed
	});

const fuseCatOptions = {
	findAllMatches: true,
	distance: 600,
	useExtendedSearch: true,
	minMatchCharLength: 2,
	threshold: 0.3,
	keys: [
		{ name: 'name', weight: 1 }
	]
};


// -- Products DB (Firebase - ASYNCHRONOUS) -->
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
	databaseURL: "https://bgc-db-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const allProdsDB = ref(database, "data/variations");

// Wrap the Firebase onValue listener in a Promise so we can use Promise.all
const fetchProductsPromise = new Promise((resolve, reject) => {
	onValue(allProdsDB, (snapshot) => {
		if (snapshot.exists()) {
			// Assign to the GLOBAL allProdsData
			allProdsData = Object.values(snapshot.val());
			console.log("Products data fetched and assigned:", allProdsData.length, "items");
			resolve(allProdsData); // Resolve the promise when data is available
		} else {
			console.log("No product data available from Firebase.");
			allProdsData = []; // Ensure it's empty if no data
			resolve([]); // Resolve with empty array to not block Promise.all
		}
	}, (error) => {
		console.error("Error fetching products from Firebase:", error);
		reject(error); // Reject the promise on error
	});
});

const fuseProdOptions = {
	findAllMatches: true,
	distance: 600,
	useExtendedSearch: true,
	minMatchCharLength: 2,
	threshold: 0.3,
	keys: [
		{ name: 'variation_name', weight: 4 },
		{ name: 'variation_number', weight: 3 },
		{ name: 'attributes.attr_value', weight: 2 },
		{ name: 'brand', weight: 1 },
	]
};


// -- Define Debounce Function (Can be defined anywhere, doesn't depend on data/DOM) -->
function debounce(func, delay) {
	let timeoutId;
	return function(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}


// --- MAIN APPLICATION INITIALIZATION ---
// This function will run AFTER the DOM is ready AND all necessary data is fetched.
function initializeApplicationLogic() {
	console.log("--> Initializing Application Logic <--");

	// Initialize Fuse.js instances here, as both allCatsData and allProdsData are guaranteed to be populated
	fuseCat = new Fuse(allCatsData, fuseCatOptions);
	fuseProd = new Fuse(allProdsData, fuseProdOptions);


	// -- Initialize DOM Elements (MUST be inside DOMContentLoaded or a function called by it) -->
	const searchInput = document.getElementById("search-input");
	const searchClear = document.getElementById("search-clear");
	const searchLabel = document.getElementById("search-list-label");
	const catList = document.getElementById("cat-list");
	const prodList = document.getElementById("prod-list");
	const catHome = document.getElementById("cat-home");
	const toggleCart = document.getElementById("toggle-cart");
	const cartList = document.getElementById("cart-list");
	const cartLabel = document.getElementById("cart-label");
	const cartCounter = document.getElementById("cart-counter");
	const cartCTA = document.getElementById("cart-cta");
	const loadingIndicator = document.getElementById("loading-indicator");
	const loadingOverlay = document.getElementById("loading-overlay");
	const formCartItems = document.getElementById("form-cart-items");


	// -- Update DOM Elements Functions (defined here to access DOM elements) -->
	function clearSearchInput() { searchInput.value = ""; };
	function clearSearchLabel() { searchLabel.innerHTML = ""; };
	function clearCatList() { catList.innerHTML = ""; };
	function appendItemToCatList(item) { catList.innerHTML += item; };
	function clearProdList() { prodList.innerHTML = ""; };
	function appendItemToProdList(item) { prodList.innerHTML += item; };
	function showCartCTA() { cartCTA.style.display = "block"; }
	function hideCartCTA() { cartCTA.style.display = "none"; }
	function showLoading() {
		loadingIndicator.style.display = "block";
		loadingOverlay.style.display = "block";
	}
	function hideLoading() {
		loadingIndicator.style.display = "none";
		loadingOverlay.style.display = "none";
	}

	// --- All your other functions and event listeners that depend on DOM elements and fetched data ---

	// -- X Out Search
	searchClear.addEventListener('click', function(){
		clearSearchInput();
		clearSearchLabel();
		clearCatList();
		clearProdList();
	});

	// -- Search Cats & Prods -->
	function searchCatsAndProds(inv) {
		let searchQuery = inv;

		// Get Result Array (with a max limit) for better performance
		const catResult = Object.values(fuseCat.search(searchQuery, {limit: 20}));
		console.log("Cats :", catResult);

		// Get Result Array (with a max limit) for better performance
		const prodResult = Object.values(fuseProd.search(searchQuery, {limit: 20}));
		console.log("Prods :", prodResult);

		if ( catResult.length === 0 && prodResult.length === 0 ) {
			hideCart();
			searchLabel.innerHTML = "No Results for... "+ searchQuery;
		} else {
			hideCart();
			searchLabel.innerHTML = "Results for... "+ searchQuery;

			for (let k = 0; k < catResult.length; k++) {
				const category = catResult[k];
				let itemName = category.item.name;
				let itemCatID = category.item.catid;
				let resultItem = `<li class="pill label box-shadow-blue" tabindex="0" data-catid="${itemCatID}" data-name="${itemName}">${itemName}</li>`;
				appendItemToCatList(resultItem);
			}

			for (let i = 0; i < prodResult.length; i++) {
				const product = prodResult[i];
				let itemNumber = product.item.variation_number;
				let itemName = product.item.variation_name;
				let itemNameSpaced = itemName.replace(/\./g, " ");
				let itemImage = product.item.image;
				let itemBrand = product.item.brand;
				let itemAttr = Object.values(product.item.attributes || {});

				let resultItem = `<li class="item">
					<div class="thumbnail img-cover" style="background-image: url('https://bgc.sixorbit.com/${itemImage}')"></div>
					<div class="details label">
						<div class="small text-neutral-3">ID: ${itemNumber} | Brand : ${itemBrand}</div>
						<div class="name p font-h text-blue">${itemNameSpaced}</div>
						<div class="attr small text-neutral-6">
						${itemAttr
						  .filter(item => item.attr_value && item.attr_value.length > 0)
						  .map(item => `<span>${item.attr_name} : ${item.attr_value}</span>`)
						  .join(" | ")}
						</div>
					</div>
					<button class="add-item button fill-blue box-shadow-blue block" data-id="${itemNumber}" data-name="${itemNameSpaced}" style="padding: 0; text-align: center;"><i class='h5 bx bx-plus' style="line-height: inherit;"></i></button>
				</li>`;
				appendItemToProdList(resultItem);
			}
		}
		hideLoading();
	}

	// -- Search Input Function -->
	function searchInputChange() {
		let searchVal = searchInput.value;
		if ( searchVal.length === 0 ) {
			clearSearchLabel();
			clearCatList();
			clearProdList();
		} else {
			showLoading();
			setTimeout(() => {
				clearSearchLabel();
				clearCatList();
				clearProdList();
				searchCatsAndProds(searchVal);
			}, 2000);
		}
	}

	// -- Debounce Search Input Function -->
	const debouncedInputChangeHandler = debounce(searchInputChange, 850);
	searchInput.addEventListener('input', debouncedInputChangeHandler);

	// -- Cat Pill Event Listener
	catList.addEventListener('click', function(event){
		const activeCat = event.target.closest('li.pill');
		if (activeCat) {
			const activeCatID = activeCat.dataset.catid;
			const activeCatName = activeCat.dataset.name;
			showLoading();
			setTimeout(() => {
				clearSearchInput();
				clearSearchLabel();
				clearCatList();
				clearProdList();
				activeCatList(activeCatID, activeCatName);
			}, 2000);
		}
	});

	function activeCatList(activeCatID, activeCatName) {
		searchLabel.innerHTML = "Browse by... " + activeCatName;
		for (let i = allCatsData.length - 1; i >= 0; i--) {
			const subCat = allCatsData[i];
			if ( activeCatID == subCat.main_parent && activeCatID != subCat.catid ) {
				let subCatID = subCat.catid;
				let subCatName = subCat.name;
				let resultCat = `<li class="pill label box-shadow-blue" tabindex="0" data-catid="${subCatID}" data-name="${subCatName}">${subCatName}</li>`;
				appendItemToCatList(resultCat);
			}
		}

		for (let l = 0; l < allProdsData.length; l++) {
			let prodSubCat = allProdsData[l];
			if ( activeCatID == prodSubCat.category_id) {
				let itemNumber = prodSubCat.variation_number;
				let itemName = prodSubCat.variation_name;
				let itemNameSpaced = itemName.replace(/\./g, " ");
				let itemImage = prodSubCat.image;
				let itemBrand = prodSubCat.brand;
				let itemAttr = Object.values(prodSubCat.attributes || {});

				let prodSubCatList = `<li class="item">
					<div class="thumbnail img-cover" style="background-image: url('https://bgc.sixorbit.com/${itemImage}')"></div>
					<div class="details label">
						<div class="small text-neutral-3">ID: ${itemNumber} | Brand : ${itemBrand}</div>
						<div class="name p font-h text-blue">${itemNameSpaced}</div>
						<div class="attr small text-neutral-6">
						${itemAttr
						  .filter(item => item.attr_value && item.attr_value.length > 0)
						  .map(item => `<span>${item.attr_name} : ${item.attr_value}</span>`)
						  .join(" | ")}
						</div>
					</div>
					<button class="add-item button fill-blue box-shadow-blue block" data-id="${itemNumber}" data-name="${itemNameSpaced}" style="padding: 0; text-align: center;"><i class='h5 bx bx-plus' style="line-height: inherit;"></i></button>
				</li>`;
				appendItemToProdList(prodSubCatList);
			}
		}
		hideLoading();
	}

	// -- Cat Home Function -->
	function catHomeCatList() {
		hideCart();
		searchLabel.innerHTML = "Browse by Category : [ All ]";
		for (let i = 0; i < allCatsData.length; i++) {
			const mainCat = allCatsData[i];
			if ( mainCat.catid == mainCat.main_parent) {
				let mainCatID = mainCat.catid;
				let mainCatName = mainCat.name;
				let resultCat = `<li class="pill label box-shadow-blue" tabindex="0" data-catid="${mainCatID}" data-name="${mainCatName}">${mainCatName}</li>`;
				appendItemToCatList(resultCat);
			}
		}
	}

	// -- Cat Home Event Listener -->
	catHome.addEventListener('click', function(){
		clearSearchInput();
		clearSearchLabel();
		clearCatList();
		clearProdList();
		catHomeCatList();
	});

	// -- Add to Cart Functionality -->
	let allCartItems = []; // Array to store selected product objects

	prodList.addEventListener('click', function(event){
		const activeProd = event.target.closest('li.item .add-item');
		if (activeProd) {
			const activeProdID = activeProd.dataset.id;
			const activeProdName = activeProd.dataset.name;
			const productExists = allCartItems.some(product => product.id === activeProdID);

			if (!productExists) {
				const productObject = {
					id: activeProdID,
					name: activeProdName
				};
				allCartItems.push(productObject);
				cartList.innerHTML = "";
				updateCart();
				updateFormCartItems();
			}
		}
	});

	function updateCart() {
		if (allCartItems.length !== 0) {
			cartList.innerHTML = "";
			for (let i = 0; i < allCartItems.length; i++) {
				const cartItemID = allCartItems[i].id
				const cartItemName = allCartItems[i].name
				const cartItem =  `<li class="cart-item" data-id="${cartItemID}">
				<button class="button remove-from-cart text-blue"><i class='h5 bx bx-x-circle' style="line-height: inherit;"></i></button>
				<span class="info">
				<div class="small inline">ID: ${cartItemID}</div>
				<div class="name p strong font-h">
					${cartItemName}</div></span></li>`;
				appendCart(cartItem);
				cartLabel.innerHTML = "Items in cart... "+ allCartItems.length;
				cartCounter.innerHTML = allCartItems.length;

				showCartCTA();
			}
		} else {
			cartLabel.innerHTML = "Items in cart... 0";
			cartCounter.innerHTML = "";
			hideCartCTA();
		}
	}

	function appendCart(item) { cartList.innerHTML += item; };

	// -- Detect Remove From Cart -->
	cartList.addEventListener('click', function(event){
		const activeCart = event.target.closest('li.cart-item');
		const removeButton = event.target.closest('li.cart-item .remove-from-cart');

		if (removeButton) {
			const activeCartID = activeCart.dataset.id;
			allCartItems = allCartItems.filter(item => item.id !== activeCartID);
			cartList.innerHTML = "";
			updateCart();
			updateFormCartItems();
		}
	});

	// Toggle Cart
	function hideCart() {
		if (toggleCart.checked === true) {
			toggleCart.checked = false;
		}
	}

	// Update Form Cart Item
	function updateFormCartItems() {
		formCartItems.innerHTML = "";
		if (allCartItems.length !== 0) {
			let itemsText = allCartItems.map(item => `${item.id} - ${item.name}`).join(" , \n");
			formCartItems.innerHTML = itemsText;
		} else {
			formCartItems.innerHTML = "No Items in cart, please search and add from catalogue above";
		}
	}

	// Initial call to display categories
	// catHomeCatList();
	// hideLoading(); // Hide loading once all data and initial UI are ready

} // End of initializeApplicationLogic


// --- Entry Point: Wait for DOM to be fully loaded ---
document.addEventListener("DOMContentLoaded", function() {
	
	// Use Promise.all to wait for BOTH data sources to be ready
	Promise.all([fetchCategoriesPromise, fetchProductsPromise])
		.then(() => {
			// Once BOTH promises resolve, it means allCatsData and allProdsData are populated.
			// Now, it's safe to run the main application logic.
			initializeApplicationLogic();
		})
		.catch(error => {
			console.error("Failed to load essential data:", error);
			hideLoading(); // Hide loading even if there's an error
			// Optionally, display an error message to the user on the UI
		});
});