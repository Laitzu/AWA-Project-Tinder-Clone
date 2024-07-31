let firstTime = true;

document.addEventListener('DOMContentLoaded', function() {
    let currentMatchId = null;
    const pollInterval = 3000; // Poll every 3 seconds
    let polling = false;
    // Yes global variables again, but otherwise you can (accidentally) spam API calls...
    let pollingIntervalId = null;

    // load all matches of logged in user and display them on the page
    loadMatches();

    async function loadMatches() {
        // Get all matches from database
        // db uses session id to get the right matches
        const res = await fetch('/api/matches');
        const matches = await res.json();

        // Access the html element which contains the matches and
        // initialize it as empty
        const matchesList = document.getElementById('matches-list');
        matchesList.innerHTML = '';
        // Loop through matches and add a list item with the
        // information of the matched person
        matches.forEach(match => {
            const li = document.createElement('li');
            li.classList.add("match");
            li.textContent = match.firstName + " " + match.lastName;
            // Also add onclick listener that when pressed opens a chat
            // with the match in question
            li.addEventListener('click', () => joinChat(match._id, match.firstName));
            matchesList.appendChild(li);
        });
    }

    function joinChat(matchId, matchName) {
        // Initialize chat window information and make it visible
        document.getElementById("chat-with").innerHTML = "Chat with " + '<a id="profile-link">' + matchName + "</a>";   // Also link to users profile

        // Add listener for clicking the users name that then gives you the users profile
        document.getElementById("profile-link").addEventListener("click", function(event) {
            event.preventDefault();
            console.log("matchId = " + matchId);
            loadUserProfile(event, matchId);
        });
        document.getElementById("chat-history").innerHTML = "";
        document.getElementById("chat-section").classList.remove("hide");
        // Update currentMatchId to selected matches id (chat)
        currentMatchId = matchId;

        fetchMessages(); // Initial load of chat history
        firstTime = true;

        // Clear the existing polling interval if any
        if (pollingIntervalId !== null) {
            clearInterval(pollingIntervalId);
            pollingIntervalId = null;
        }

        // After initializing is done start polling for new messages
        // at the set interval
        startPolling();

        // Also create the method for submitting a chat message
        document.getElementById("send-message-form").onsubmit = async (event) => {
            event.preventDefault();
            const messageInput = document.getElementById("chat-message");
            const message = messageInput.value;
            // Check that message is not empty
            if (message != "") {
                // Send message and empty input field
                await sendMessage(matchId, message);
                messageInput.value = "";
            }
        };
    }

    // Fetch messages from server
    async function fetchMessages() {
        // Check that a match (chat) is selected and that we are not already polling
        if (!currentMatchId || polling) return;

        // Then start polling and fetch the messages for the current match (chat)
        polling = true;
        const res = await fetch("/api/chat/" + currentMatchId);
        const messages = await res.json();

        // Check if messages exist for the match (chat)
        if (messages.length > 0) {
            // If messages exist, display them
            displayMessages(messages);
        } else {
            // Otherwise display prompt to start chatting
            const chatHistory = document.getElementById("chat-history");
            chatHistory.innerHTML = "No messages yet, start chatting!";
        }
        // Stop polling => allows other fetch requests to happen
        polling = false;
    }

    // Function to start polling (fetching) for messages in chat at set interval
    function startPolling() {
        pollingIntervalId = setInterval(fetchMessages, pollInterval);
    }


    // Display messages fetched from db to user
    function displayMessages(messages) {
        // Get access to chat element and clear it
        const chatHistory = document.getElementById('chat-history');
        chatHistory.innerHTML = '';
        // Create div with class chat-message for each message
        messages.forEach(({ sender, message, timestamp }) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message');

            // Check if the message is from the logged-in user or the matchee and
            // set an appropriate class for the message div
            if (String(sender._id) == String(document.getElementById("chat-section").dataset.userId)) {
                messageElement.classList.add('my-message');
            } else {
                messageElement.classList.add('other-message');
            }
            // For some reason setting <strong> makes everything not strong
            // and css doesn't seem to want to cooperate so you get this mess
            messageElement.innerHTML = sender.firstName + ": " + "<strong>" + message + "</strong> " + "<strong>" + "<small>" + new Date(timestamp).toLocaleTimeString() + "</small>" + "</strong>";
            chatHistory.appendChild(messageElement);
        });

        // Scroll to bottom of messages (to newest) if firstTime = true
        // which is the case when opening a chat
        scrollToBottom(chatHistory);
    }

    function scrollToBottom(chatHistory) {
        // So that when you open a chat you get sent to the bottom but
        // not everytime the client polls for messages
        if (firstTime) {
            // Scroll to the bottom
            chatHistory.scrollTop = chatHistory.scrollHeight; 
            firstTime = false;
        }
    }


    // Send message to server
    async function sendMessage(matchId, message) {
        await fetch("/api/chat/" + matchId + "/send", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        // Also set firstTime to true so that you get scrolled
        // to the bottom of the chat when YOU send a new message
        firstTime = true;
    }
});
