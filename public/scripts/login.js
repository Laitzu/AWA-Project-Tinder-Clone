if (document.readyState !== "loading") {
    initializeCodeLogin();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCodeLogin();
    });
}

function initializeCodeLogin() {
    document.getElementById("login-form").addEventListener("submit", onSubmit)
}


function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/user/login", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.token) {
                storeToken(data.token);
                window.location.href="/";
            } else {
                const authSection = document.getElementById("auth-section");
                authSection.innerHTML = data.message;
            }
        })

}

function storeToken(token) {
    localStorage.setItem("auth_token", token);
}
