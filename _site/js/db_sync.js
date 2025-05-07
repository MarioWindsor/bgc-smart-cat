document.addEventListener("DOMContentLoaded", function() {
	async function fetchData() {
		try {
			// Step 1: Login and get the access token
			const loginUrl = 'https://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=login&email=dev@bgc.com&password=1234&app_flag=2&network_ip=10.0.2.16';
			const loginResponse = await fetch(loginUrl);
			const loginData = await loginResponse.json();

			if (loginData && loginData.data && loginData.data.access_token) {
				const accessToken = loginData.data.access_token;
				const userId = '410002480'; // Assuming this is constant

				// Step 2: Fetch variations and extract subset
				const variationsUrl = `https://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=variation/fetch&user_id=${userId}&access_token=${accessToken}&last_updated&limit=&searchtext&limit_bit=0`;
				const variationsResponse = await fetch(variationsUrl);
				const variationsData = await variationsResponse.json();

				if (variationsData && variationsData.data.variations && Array.isArray(variationsData.data.variations)) {
					const subsetOfVariations = variationsData.data.variations.map(variation => {
						// Define the fields you want to extract
						return {
							variation_number: variation.variation_number,
							variation_name: variation.variation_name,
							image: variation.image,
							brand: variation.brand,
							category: variation.category,
							category_id: variation.category_id,
							main_category: variation.main_category,
							main_category_id: variation.main_category_id,
							attributes: variation.attributes,
						};
					});

					// downloadJson(subsetOfVariations, 'variations_subset.json');
					console.log('Subset of variations data downloaded successfully!');
					const nestedVarArray = {
						data : {
							variations : subsetOfVariations
						}
					};

					console.log(nestedVarArray);
					downloadJson(nestedVarArray, 'variations_new.json');

				} else {
					console.error('Variations data structure is not as expected.');
				}

				// Step 3: Fetch categories (download all category data)
				const categoriesUrl = `http://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=variation/fetch_category&user_id=${userId}&access_token=${accessToken}`;
				const categoriesResponse = await fetch(categoriesUrl);
				const categoriesData = await categoriesResponse.json();

				// downloadJson(categoriesData, 'categories.json');
				
				console.log('Categories data downloaded successfully!');

			} else {
				console.error('Failed to retrieve access token.');
			}

		} catch (error) {
			console.error('An error occurred:', error);
		}
	}

	// Helper function to download JSON data as a file
	function downloadJson(data, filename) {
		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Call the function to start the process
	fetchData();

});