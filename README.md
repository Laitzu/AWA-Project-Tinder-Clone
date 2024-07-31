# Tinder Clone Docs

## Project Overview
This project is a Tinder Clone web application. Some features of it include:
- Registering and logging in
- Being able to edit your profile information
- Liking and disliking other users
- Being able to chat in "real-time" with people you matched with

## Technology Choices

### Backend
- **Node.js**: Node.js is a versatile and lightweight server architecture
- **Express.js**: A common framework built on top of Node.js. Great for routing.
- **MongoDB**: A common database system that is simple to use but also quite fast.

### Misc technical stuff
- The chat is updated by polling the database for the chat messages every few seconds
- This could have been done with web sockets etc. But I didn't have time for that with this project, maybe in the future I will update the project
- ChatGPT 4o was utilized heavily for the CSS and HTML (pug) parts. Not that I couldn't have done it myself, but I do not have an imagination. The HTML and CSS had to be manually changed moderately as well since some things just didn't work
- The CSS might (will) have some obsolete parts that do not do anything, they are remnants of trying to make stuff change but for some reason it not working. After a while I forgot what parts worked and what didn't, then, I didnt't have time anymore to clean up
- ChatGPT 4o was also utilized elsewhere but its role centered a lot more around giving a template or prototype for functions that were then heavily modified to actually work / work as intended
- The code is heavily commented to avoid minus points from lack of commenting, I hope it is enough
- There are many unused server responses (statuses and messages) I had ideas in mind, but mostly ran out of time / felt like all of them didnt need to even exists but I left them in anyway if as some did get used and maybe some debug information can be gained from them
- For testing, create a couple test accounts (There are no name, email or password restrictions) and then log in as a few of them browsing through the profiles
- If you want to create dummy users you can create them with the "generateUsers.js" file. Instructions are included inside the file

### Frontend
- **Pug**: A template engine for HTML used for making HTML writing a lot more easier
- **Materialize**: A CSS framework used to make the app more responsive and cleaner looking

## Installation Guidelines

### Prerequisites
1. **Node.js**
2. **MongoDB**

### Steps to setup the application

1. **Clone the Repository**
    - Clone this repository to your own device

2. **Install Dependencies**
   - Run the following command:
   - npm install

3. **Environment Configuration**
   - Set the session secret (.env variable used for authentication)

4. **Start MongoDB**
   - Whatever way you are using mongodb, make sure to set the database correctly

5. **Run the Application**
   - Use either of the following commands:
   - nodemon start
   - OR
   - npm start

7. **Access the Application**
   - Navigate to `http://localhost:3000` in your browser.

## User Manual

### Registration and Login
1. **Register**
   - Click on the 'Register' button on the homepage.
   - Fill in your details and click 'Register'.
2. **Login**
   - Click on the 'Login' button on the homepage.
   - Enter your email and password, then click 'Login'.

### Profile Management
- After logging in, click on "Profile" to view or edit your profile.
- You can update your bio and name information

### Browsing Profiles
- Click on 'Start Browsing Profiles' to view profiles of other users.
- You click the "Like" or "Dislike" buttons or swipe left or right to like and dislike users

### Chatting with Matches
- If you and another profile like eachother its a match!
- You can then choose to start chatting with them immediately or continue browsing through users
- If you want to start chatting later you can find your matches under "Your matches"
- Clicking on one will start a chat with them or open the chat if you have already chatted
- Filter messages by specifying a keyword and pressing "Filter"
- You can clear the filter by pressing "Clear filter"
  
### Logging out
- If you want to log out, just click on "Logout" in the upper right hand corner


### Points request
As this project was done for a school course, here is the list of features I claim to have implemented and the points for that feature:

- Basic features and well written documentation - 25p
- Swiping to like or dislike - 2p
- Search that can filter chat messages with keyword in them - 3p
- If a match is being found offer chat immediately - 2p
- Clicking on username to see user profile with user info - 2p
- Chat shows timestamp - 1p

 ## Total - 35 points
