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
	}

	const app = initializeApp(appSettings);
	const database = getDatabase(app);
	const varInDB = ref(database, "data/variations");

	// console.log(app);

	const varList = document.getElementById("cat-var-list");

	onValue(varInDB, function(snapshot) {
		if (snapshot.exists()) {

			let varListArray = Object.entries(snapshot.val());
			// console.log(varListArray[2][1].variation_name);

			// clearVarList();
			console.log(varListArray.length + ": total variations!")
			
			// for (let i = 0; i < varListArray.length; i++) {
			for (let i = 0; i < 100; i++) {
				let currentItem = varListArray[i];
				let currentItemName = varListArray[i][1].variation_name;
				console.log(currentItemName);
				appendItemToVarList(currentItemName);
			}

		} else {
			varList.innerHTML = "No items here... yet";
		}
	});

	// function clearVarList() {
	// 	varList.innerHTML = "";
	// }

	function appendItemToVarList(item) {
		varList.innerHTML += `<li>${item}</li>`; /* below is a more advanced way of doing this same thing */
		/*let itemID = item[0]
		let itemVal = item[1]
		let newL = document.createElement("li");
		newL.textContent = itemVal;

		varList.append(newL);*/

	}


});
