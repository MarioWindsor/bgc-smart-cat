document.addEventListener("DOMContentLoaded", function() {
	
	console.log('LEAD FORM : READY');

	const apiEndpoint = "https://bgc.sixorbit.com/?urlq=service&version=5.0&key=123&task=enquiry/enquiry_submit&user_id=410002480&access_token=5384832825945924612";

	const data = {
	  "smstid" : "",
	  "mail" : "1",
	  "no_of_bathroom" : "",
	  "terms_conditions" : [],
	  "image_array" : [],
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
	  "date" : "12-11-2024",
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

	fetch(apiEndpoint, {
		method: "POST",
		body: data,
		headers: {
		"Content-Type" : "application/json",
		"Access-Control-Allow-Origin": "bgc.sixorbit.com",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
		"Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, X-Requested-With"
	  }
	})
	.then(response => {
		if (!response.ok) {
			return response.text().then(err => {throw new Error(err)});
		}
		return response.json(); // Or response.text() if the API doesn't return JSON
	})
	.then(responseData => {
		console.log("Success:", responseData);
	})
	.catch(error => {
		console.error("Error:", error);
	});
	
});

