// Generate fake users into the database
// Script created entirely with ChatGPT 4o

// NOTE!!! THIS DOES NOT CREATE LIKE, DISLIKE, MATCH RELATIONS FOR THE USERS

// ************* HOW TO USE ****************
// Install faker if not already:
// npm install mongoose faker
// Make sure this file is in the repo's highest level e.g. with app.js package.json etc.
// Choose how many users you want by changing the value at the bottom of the file inside generateUsers(*Value*)
// REMEMBER TO CHANGE THE DATABASE ADDRESS TO MATCH THE ONE IN app.js!!!!!!
// Run the following command:
// node generateUsers.js
// Wait a few seconds, it takes some time.
// ????
// Enjoy your dummy users that you can swipe through on the website


const mongoose = require('mongoose');
const faker = require('faker');
const User = require('./models/User'); // Adjust the path as needed

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tinderdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const generateRandomUsers = async (count = 50) => {
  for (let i = 0; i < count; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName);
    const password = faker.internet.password(); // You should hash the password in real scenarios
    const bio = faker.lorem.sentences(2);
    const registerDate = faker.date.past();
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      bio,
      registerDate,
      likes: [],
      dislikes: [],
      matches: [],
    });

    try {
      await newUser.save();
      console.log(`User ${i + 1} saved: ${firstName} ${lastName}`);
    } catch (err) {
      console.error(`Error saving user ${i + 1}:`, err);
    }
  }

  console.log(`${count} users generated successfully.`);
  mongoose.connection.close();
};

generateRandomUsers(50); // Generate 50 users
