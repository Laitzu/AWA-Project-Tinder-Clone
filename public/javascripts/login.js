if (document.readyState !== "loading") {
    initializeCodeLogin();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCodeLogin();
    });
}

function initializeCodeLogin() {
    //Add event listener for submit button
    document.getElementById("submit").addEventListener("click", onSubmit)
}


function onSubmit(event) {
    event.preventDefault();
    // Get data from the login form
    const formData = new FormData(document.getElementById("form-data"));

    // Debugging formData entries
    for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
    }

    // Send login data to server for authentication
    fetch("/api/login", {
        method: "POST",
        body: formData,
        redirect: "follow"  // Indicate that we want to follow redirects
    })
    .then(response => {
        if (response.redirected) {
            // If redirected, manually update the window location because fetch doesn't support automatic redirects :) 
            window.location.href = response.url;
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data) {
            console.log(data.message);
            // Handle other cases if needed
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


