if (document.readyState !== "loading") {
    initializeCodeRegister();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCodeRegister();
    });
}

function initializeCodeRegister() {
    document.getElementById("register-form").addEventListener("submit", onSubmit);
}

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/user/register", {
        method: "POST",
        body: formData
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        const authSection = document.getElementById("auth-section");
        if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            authSection.innerHTML = data.message;
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
