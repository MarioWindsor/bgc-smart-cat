import allCatsDB from '../media/data/category_new.json' with { type: 'json' };
const allCats = Object.values(allCatsDB.data.category);


const mainCats = document.getElementById('main-category-list'); // Replace 'yourDivId' with the actual id
const mainCatsList = mainCats.getElementsByTagName('li');

/* - On CLick Main Category - */
for (let i = 0; i < mainCatsList.length; i++) {
	mainCatsList[i].addEventListener('click', function() {
		let activeCatId = this.dataset.catid;
		let activeCatName = this.dataset.name;
		console.log('Active Category:', activeCatId ," - ", activeCatName);
		console.log('Sub Category:');

		clearSubCatList();

		updateSubCatListLabel(activeCatName);

		/* - List all Sub Category Names with activeCatId as parent category as - */
		for (let j = allCats.length - 1; j >= 0; j--) {
			if ( activeCatId == allCats[j].main_parent && activeCatId != allCats[j].catid ) {
				let subCatId = allCats[j].catid
				let subCatName = allCats[j].name
				console.log(subCatId , " - " , subCatName);
				appendSubCatList(subCatName);
			}
		}

	});
}

const activeCatList = document.getElementById("catagory-items-list");
const activeCatListLabel = document.getElementById("catagory-items-list-label");

function clearSubCatList() {
	activeCatList.innerHTML = "";
};

function appendSubCatList(item) {
	activeCatList.innerHTML += `<li>${item}</li>`;
};

function updateSubCatListLabel(CatLabel) {
	activeCatListLabel.innerHTML = "Items in ... " + CatLabel ;
};
