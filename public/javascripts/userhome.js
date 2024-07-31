if (document.readyState !== "loading") {
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initializeCode();
    });
}

// Global variables

let actionInProgress = false;


async function initializeCode() {
    //Add event listener for profile button
    document.getElementById("profile").addEventListener("click", loadUserProfile)
    // Event listener for start browsing button
    document.getElementById("start-browsing").addEventListener("click", startBrowsing);
    // Event listeners for like and dislike buttons
    document.getElementById("like-button").addEventListener("click", likeProfile);
    document.getElementById("dislike-button").addEventListener("click", dislikeProfile);


    const res = await fetch("/users/me");
    const user = await res.json();

    // Save logged in user id to page for later use
    document.getElementById("chat-section").dataset.userId = user._id;

    document.getElementById("edit-profile-button").addEventListener("click", function(event) {
        // Show edit form
        document.getElementById("edit-form-section").classList.remove("hide");
        loadUserProfile(event, null);
    });

    document.getElementById("submit-edit").addEventListener("click", submitEdit);
    document.getElementById("cancel-edit").addEventListener("click", cancelEdit);

}

function startBrowsing() {
    document.getElementById("browsing").classList.remove("hide");
    document.getElementById("start-browsing").classList.add("hide");
    loadRandomProfile();
}

async function loadUserProfile(event, id) {
    event.preventDefault();

    let user = {};
    console.log(!id);
    // If given an id fetch the profile matching the id
    if(!id) {
        // If no id fetch logged in users profile data from server
        const res = await fetch("/users/me");
        user = await res.json();

        // Prefill edit form inputs
        document.getElementById("edit-firstname").value = user.firstName;
        document.getElementById("edit-lastname").value = user.lastName;
        document.getElementById("edit-bio").value = user.bio;

        document.getElementById("edit-profile-button").classList.remove("hide");

    } else {
        // Fetch profile of given user
        const res = await fetch("/users/profile/" + id);
        user = await res.json();
        document.getElementById("edit-profile-button").classList.add("hide");
    }

    const name = document.getElementById("name");
    const registerDate = document.getElementById("register-date");
    const bio = document.getElementById("bio");

    // Populate 
    name.innerText = user.firstName + " " + user.lastName;
    registerDate.innerText = "User since " + user.registerDate.split("T")[0];
    bio.innerText = "Bio: " + user.bio;


    // Update Materialize labels and textareas
    M.updateTextFields();
    M.textareaAutoResize(document.getElementById('edit-bio'));

    // Make profile background card visible by removing the "hide class from it"
    document.getElementById("profile-card").classList.remove("hide");
    document.getElementById("profile-section").classList.remove("hide");

    // Scroll user to profile-section
    document. getElementById("profile-section").scrollIntoView({ behavior: "smooth" })
}

async function loadRandomProfile() {

    // Fetch a random users profile from server

    const res = await fetch("/users/random");
    let user = await res.json();

    if(user.message) {
        document.getElementById("random-profile-bio").innerText = "";

        document.getElementById("random-profile-name").innerText = user.message;
        document.getElementById("like-button").classList.add("hide");
        document.getElementById("dislike-button").classList.add("hide");
    } else {

        document.getElementById("random-profile-name").innerHTML = '<a id="profile-link">' + user.firstName + " " + user.lastName; + "</a>";

        // Add listener for clicking the users name that then gives you the users profile
        document.getElementById("profile-link").addEventListener("click", function(event) {
            event.preventDefault();
            console.log("matchId = " + user._id);
            loadUserProfile(event, user._id);
    });
        document.getElementById("random-profile-bio").innerText = user.bio;

        document.getElementById("like-button").classList.remove("hide");
        document.getElementById("dislike-button").classList.remove("hide");

        // Add swipe detection to the browsing card
        const profileCard = document.getElementById('browsing');
        const hammer = new Hammer(profileCard);

        hammer.on('swipeleft', () => {
            likeProfile(); // Call the like function on swipe left
        });

        hammer.on('swiperight', () => {
            dislikeProfile(); // Call the dislike function on swipe right
        });

        // Also set the users id into the DOM element to be used by other functions such as like / dislike
        document.getElementById("browsing").dataset.userId = user._id;
    }

    console.log(user.message);
}

async function likeProfile() {
    // Because async functions like to make a gazillion requests if not stopped
    if(actionInProgress) {
        return;
    }
    actionInProgress = true;

    const profileCard = document.getElementById('browsing');
    profileCard.classList.add('swipe-right');


    // Get user's ID from DOM element
    const userId = profileCard.dataset.userId;

    let res = await fetch("/users/like/" + userId, {
        method: "POST",
    });

    data = await res.json();
    if (data.match) {
        // Display the modal with options for the user
        // to either start the chat now or continue browsing users
        document.getElementById("match-message").innerText = "You've matched with " + data.matchedUser.firstName + "! What would you like to do?";
        const matchModal = M.Modal.getInstance(document.getElementById("match-modal"));
        loadRandomProfile();
        matchModal.open();

        // If user wants to start chat
        document.getElementById("start-chat").onclick = () => {
            // Start the chat and scroll view to chat-section
            matchModal.close();
            joinChat(data.matchedUser._id, data.matchedUser.firstName);
            document.getElementById("chat-section").scrollIntoView({ behavior: "smooth" });
        };

        // If user doesn't want to start chat, get a new user to browse
        document.getElementById("continue-browsing").onclick = () => {
        };
    } else {
        loadRandomProfile();
    }
    // Remove the animation class after the animation completes
    setTimeout(async () => {
        profileCard.classList.remove("swipe-right");
    }, 300); // Matches the transition duration

    actionInProgress = false;
}

async function dislikeProfile() {
    // Because async functions like to make a gazillion requests if not stopped
    if(actionInProgress) {
        return;
    }
    actionInProgress = true;
    const profileCard = document.getElementById("browsing");
    profileCard.classList.add("swipe-left");

    // Get user's ID from DOM element
    const userId = profileCard.dataset.userId;

    await fetch("/users/dislike/" + userId, {
        method: "POST",
    });
    loadRandomProfile();

    // Remove the animation class after the animation completes
    setTimeout(async () => {
        profileCard.classList.remove("swipe-left"); // Remove class after action
    }, 300); // Matches the transition duration

    actionInProgress = false;
}


async function submitEdit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("edit-profile-form"));

    // Since formData is playing with me and I dont have time, I will
    // make it into json and send that
    dataJson = {};
    formData.forEach((value, key) => {
        dataJson[key] = value;
    })

    const res = await fetch("users/me", {
        method: "POST",
        body: JSON.stringify(dataJson),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if(res.status == 200) {
        loadUserProfile(event);
    }

    document.getElementById("edit-form-section").classList.add("hide");
}

function cancelEdit(event) {
    event.preventDefault();
    // Hide edit form
    document.getElementById("edit-form-section").classList.add("hide");

}