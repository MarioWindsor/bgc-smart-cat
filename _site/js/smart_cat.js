/*
 *	Smart Catalogue : Refactored
 */

// -- FUZE Fuzzy Search Library -->
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs'



// -- Categories DB -->
import allCatsDB from '../media/data/category_new.json' with { type: 'json' };
const allCatsData = Object.values(allCatsDB.data.category);



// -- Products DB -->
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
	databaseURL: "https://bgc-smart-cat-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const allProdsDB = ref(database, "data/variations");
let allProdsData;


document.addEventListener("DOMContentLoaded", function() {
	
	// Initialize DOM Elements
	const searchInput = document.getElementById("search-input");
	const searchClear = document.getElementById("search-clear");
	const searchLabel = document.getElementById("search-list-label");
	const searchProdList = document.getElementById("search-prod-list");
	const searchCatList = document.getElementById("search-cat-list");



	// -- Wait for Firebase Connection
	onValue(allProdsDB, function(snapshot) {
			const allProdsData = Object.values(snapshot.val());
			
	});

});
