if (document.readyState !== "loading") {
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCode();
    });
}

function initializeCode() {
    //Add event listener for profile button
    document.getElementById("profile").addEventListener("click", loadUserProfile)
    // Event listener for start browsing button
    document.getElementById("start-browsing").addEventListener("click", startBrowsing);
    // Event listeners for like and dislike buttons
    document.getElementById("like-button").addEventListener("click", dislikeProfile);
    document.getElementById("dislike-button").addEventListener("click", dislikeProfile);
}

function startBrowsing() {
    document.getElementById("browsing").classList.remove("hide");
    document.getElementById("start-browsing").classList.add("hide");
    loadRandomProfile();
}

async function loadUserProfile(event) {
    event.preventDefault();

    // Fetch logged in users profile data from server
    const res = await fetch("/users/me");
    const user = await res.json();


    const name = document.getElementById("name");
    const registerDate = document.getElementById("register-date");
    const bio = document.getElementById("bio");
    

    // Populate 
    name.innerText = user.firstName + " " + user.lastName;
    registerDate.innerText = "User since " + user.registerDate.split("T")[0];
    bio.innerText = "Bio: " + user.bio;

    // Make profile background card visible by removing the "hide class from it"
    document.getElementById("profile-card").classList.remove("hide");
    document.getElementById("profile-section").classList.remove("hide");
}

async function loadRandomProfile() {
    event.preventDefault();

    // Fetch a random users profile from server

    const res = await fetch("/users/random");
    let user = await res.json();

    // Because mongo returns a list with the sample method
    user = user[0];

    document.getElementById("random-profile-name").innerText = user.firstName + " " + user.lastName;
    document.getElementById("random-profile-bio").innerText = user.bio;

    console.log(user);
}

function likeProfile() {




    loadRandomProfile();
}

function dislikeProfile(event) {




    loadRandomProfile();
}