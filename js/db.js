/*
 *	Inserting Data Into Firebase DB
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
// import { add } from "../js/functions.js"

document.addEventListener("DOMContentLoaded", function() {
	// console.log(add(2,3));

	const appSettings = {
		databaseURL: "https://playground-23b44-default-rtdb.asia-southeast1.firebasedatabase.app/"
	}

	const app = initializeApp(appSettings);
	const database = getDatabase(app);
	const shopingListInDB = ref(database, "shoppingList");

	// console.log(app);

	const inputField = document.getElementById("input-field");
	const addButton = document.getElementById("add-button");
	const shopingList = document.getElementById("shopping-list");

	addButton.addEventListener("click", function() {
		let inputValue = inputField.value;

		push(shopingListInDB, inputValue);

		clearInputField();
		//appendItemToShopingList(inputValue); /* local data not append not requied when fetching from db */

		console.log(inputValue + " added to database!");
	});

	onValue(shopingListInDB, function(snapshot) {
		if (snapshot.exists()) {

			let shopingListArray = Object.entries(snapshot.val());
			//console.log(shopingListArray);

			clearShoppingList();
			
			for (let i = 0; i < shopingListArray.length; i++) {
				let currentItem = shopingListArray[i];
				let currentItemID = currentItem[0];
				let currentItemVal = currentItem[1];
				//console.log(currentItem);
				appendItemToShopingList(currentItem);
			}

		} else {
			shopingList.innerHTML = "No items here... yet";
		}
	});

	function clearInputField() {
		inputField.value = "";
	}

	function clearShoppingList() {
		shopingList.innerHTML = "";
	}

	function appendItemToShopingList(item) {
		//shopingList.innerHTML += `<li>${itemVal}</li>`; /* below is a more advanced way of doing this same thing */
		let itemID = item[0]
		let itemVal = item[1]
		let newL = document.createElement("li");
		newL.textContent = itemVal;

		/* removing elements */
		newL.addEventListener("dblclick", function() {
			console.log(itemID);
			console.log(itemVal);
			let entryLocationInDB = ref(database, `shoppingList/${itemID}`);
			console.log(entryLocationInDB);
			remove(entryLocationInDB);
		});

		shopingList.append(newL);

	}


});
