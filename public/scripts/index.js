if (document.readyState !== "loading") {
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCode();
    });
}

function initializeCode() {

    const authSection = document.getElementById("auth-section");
    const token = localStorage.getItem("auth_token");

    // ChatGPT came up with this clean looking logic and the usage of the `` characters

    if (token) {
        // If there is a token, decode user information from it
        const payload = JSON.parse(atob(token.split(".")[1]));
        authSection.innerHTML = `
        <p>Welcome, ${payload.email}</p>
        <a href="" id="logout">Logout</a>
        `;

        // Add listener for clicking the logout link
        document.getElementById("logout").addEventListener("click", logout);
    } else {
        // If no token, display reg and login links

        authSection.innerHTML = `
            <a href="/register.html">Register</a>
            <a href="/login.html">Login</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("auth_token");
    window.location.href = "/";
}
