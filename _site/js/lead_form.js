document.addEventListener("DOMContentLoaded", function() {
	
	console.log('LEAD FORM : READY');

	const apiEndpoint = "https://bgc.sixorbit.com/?urlq=service&version=5.0&key=123&task=enquiry/enquiry_submit&user_id=410002480&access_token=6381229986870896132";
	// const apiEndpoint = "https://go.x2u.in/proxy?email=mario.windsor@gmail.com&apiKey=c417396c&url=https://bgc.sixorbit.com/?urlq=service&version=5.0&key=123&task=enquiry/enquiry_submit&user_id=410002480&access_token=6381229986870896132";
	// const apiEndpoint = "https://go.x2u.in/proxy?email=mario.windsor@gmail.com&apiKey=c417396c&url=https://bgc.sixorbit.com/?urlq=service&version=5.9&key=123&task=enquiry/enquiry_submit&user_id=410002480&access_token=6381229986870896132";

	const data = {
		// "version" : "5.0",
		"smstid" : "",
		"mail" : "1",
		"no_of_bathroom" : "",
		"terms_conditions" : [
		],
		"image_array" : [
		],
		"enquiry_remarks" : "",
		"docprefix" : "",
		"cuid" : "410271581",
		"items" : [
			{
				"name" : "COMP PLATE - EF.F.SSW.RC RDCP.25X22.3C.SS.CMPLT",
				"measurement_name" : "PCS",
				"isvid" : "411582773",
				"quantity_unit_conversion_rate" : "",
				"quantity" : "40",
				"iid" : "411870964",
				"meaid" : "27",
				"trooid" : "0"
			}
		],
		"etid" : "",
		"id" : "410000144",
		"sms" : "1",
		"baid" : "410328528",
		"date" : "24-04-2025",
		"doseries" : "317",
		"subject" : "",
		"uid" : "",
		"said" : "410328528",
		"chkid" : "410000165",
		"expected_closure_date" : "",
		"instructions" : "",
		"bit" : "1",
		"qocatid" : ""
	};

	console.log(JSON.stringify(data));

	fetch(apiEndpoint, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
		"Content-Type" : "application/json",
		"Accept": "application/json"
	  }
	})
	.then(response => {
	  if (!response.ok) {
	    throw new Error(`HTTP error! status: ${response.status}`);
	  }
	  return response.json();
	})
	.then(responseData => {
	  console.log('Success:', responseData);
	})
	.catch(error => {
	  console.error('Error:', error);
	});
	
});

