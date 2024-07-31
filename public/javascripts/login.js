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


async function onSubmit(event) {
    event.preventDefault();
    // Get data from the login form
    const formData = new FormData(document.getElementById("form-data"));

    // Send login data to server for authentication
    res = await fetch("/api/login", {
        method: "POST",
        body: formData,
        redirect: "follow"  // Indicate that we want to follow redirects
    })
    if (res.redirected) {
        // If redirected, manually update the window location because fetch doesn't support automatic redirects :) 
        window.location.href = res.url;
    } else {
        // If no redirect, display message on page under login stuff
        res = await res.json();
        console.log(res);
        document.getElementById("auth-section").innerText = res.message;
    }
}


