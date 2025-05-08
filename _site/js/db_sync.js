document.addEventListener("DOMContentLoaded", function() {
	const authform = document.getElementById("auth-form");
	const toast = document.getElementById("toast");

	authform.addEventListener('submit', function(event) {
		event.preventDefault(); // Prevent Default Form Behavior
		const formData = new FormData(this); // 'this' refers to the form element

		const email = formData.get('email');
		const password = formData.get('password');
		const action = event.submitter.value;

		async function fetchData() {
			try {

				// Step 1: Login and get the access token
				const loginUrl = `https://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=login&email=${email}&password=${password}&app_flag=2&network_ip=10.0.2.16`;
				const loginResponse = await fetch(loginUrl);
				const loginData = await loginResponse.json();

				if (loginData && loginData.data && loginData.data.access_token) {
					const accessToken = loginData.data.access_token;
					const userId = loginData.data.user_id; // Assuming this is constant

					// Step 2: Fetch Data
					toast.style.display = "inline-block";
					toast.innerHTML = "Fetching Variation Data... Please Wait";

					if (action === 'variations') {
						// Step 3-1: Fetch variations and extract subset
						// console.log("Variations");
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

							const nestedVarArray = {
								success: true,
								data : {
									variations : subsetOfVariations
								},
								result_code : 20003,
  								message : 'Variation Details Fetched'
							};

							// console.log(nestedVarArray);
							downloadJson(nestedVarArray, 'variations.json');
							// console.log('Variations data downloaded successfully!');
							
							toast.innerHTML = "Downloading variations.json";

							setTimeout(() => {
								// Your code to be executed after 5 seconds
								toast.style.display = "none";
								toast.innerHTML = "";
							}, 3500); // 5000 milliseconds = 5 seconds

						} else {
							// console.error('Variations data structure is not as expected.');
						}
						
					} else if (action === 'categories') {
						// Step 3-2: Fetch categories (download all category data)
						// console.log("Categories");
						const categoriesUrl = `https://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=variation/fetch_category&user_id=${userId}&access_token=${accessToken}`;
						const categoriesResponse = await fetch(categoriesUrl);
						const categoriesData = await categoriesResponse.json();

						// console.log(categoriesData);
						downloadJson(categoriesData, 'categories.json');
						// console.log('Categories data downloaded successfully!');

						toast.innerHTML = "Downloading categories.json";

						setTimeout(() => {
							// Your code to be executed after 5 seconds
							toast.style.display = "none";
							toast.innerHTML = "";
						}, 3500); // 5000 milliseconds = 5 seconds
					}			

				} else {
					// console.error('Failed to retrieve access token.');
				}

			} catch (error) {
				// console.error('An error occurred:', error);
			}
		}

		// Step 4: Call the function to start the process
		fetchData();

	});


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


});