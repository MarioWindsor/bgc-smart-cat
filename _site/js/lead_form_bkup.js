document.addEventListener("DOMContentLoaded", function() {

	console.log('LEAD FORM : READY');

	const apiEndpoint = "http://bgc.sixorbit.com/?urlq=service&version=5.0&task=enquiry/enquiry_submit&user_id=410002480&key=123&access_token=6381229986870896132"; // Replace with the actual API endpoint
	const data = {
  "smstid" : "",
  "sms" : "1",
  "etid" : "",
  "mail" : "1",
  "cuid" : "410271581",
  "id" : "410000144",
  "baid" : "410328528",
  "date" : "12-11-2024",
  "said" : "410328528",
  "chkid" : "410000165",
  "expected_closure_date" : "",
  "items" : [
    {
      "name" : "COMP PLATE - EF.F.SSW.RC RDCP.25X22.3C.SS.CMPLT",
      "isvid" : "411582773",
      "quantity" : "10",
      "iid" : "411870964",
      "meaid" : "27",
      "trooid" : "0"
    }
  ],
  "bit" : "1"
};


	function encodeFormData(data) {
	        const formData = new URLSearchParams(); // Use URLSearchParams

	        for (const key in data) {
	            if (data.hasOwnProperty(key)) {
	                if (Array.isArray(data[key])) {
	                    data[key].forEach((item, index) => {
	                        formData.append(`${key}[${index}]`, item); // Append array items
	                    });
	                } else {
	                    formData.append(key, data[key]); // Append regular key-value pairs
	                }
	            }
	        }
	        return formData; // Return the FormData object
	    }

	    fetch(apiEndpoint, {
	        method: "POST",
	        headers: {
	            "Content-Type": "application/x-www-form-urlencoded",
	        },
	        body: encodeFormData(data), // Pass the FormData object directly
	    })
	    .then((response) => {
	        if (!response.ok) {
	            return response.text().then(err => {throw new Error(err)});
	        }
	        return response.json(); // Try parsing as JSON first
	    })
	    .then((responseData) => {
	        console.log("Success (JSON):", responseData);
	    })
	    .catch((jsonError) => { // Catch JSON parsing errors
	        return fetch(apiEndpoint, {
	            method: "POST",
	            headers: {
	                "Content-Type": "application/x-www-form-urlencoded",
	            },
	            body: encodeFormData(data),
	        }).then(response => {
	            if (!response.ok) {
	                return response.text().then(err => {throw new Error(err)});
	            }
	            return response.text();
	        }).then(textResponse => {
	            console.log("Success (Text):", textResponse);
	        }).catch(error => {
	            console.error("Error:", error);
	        });
	    });
	
});

