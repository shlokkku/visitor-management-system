const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db'); // Adjust path if needed
const User = require('../models/User.mysql'); // Adjust the path to your User model

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const googleId = profile.id;

    // Check if user exists in MySQL
    pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return done(err);

      if (results.length > 0) {
        // User exists, return user
        return done(null, results[0]);
      } else {
        // User doesn't exist, create a new user
        const residentInsert = 'INSERT INTO Residents (full_name, wing, flat_number, role, contact_info) VALUES (?, ?, ?, ?, ?)';
        const residentValues = [name, 'A', '101', 'Tenant', '']; // You can modify wing/flat dynamically if needed
        
        pool.query(residentInsert, residentValues, (err, residentResult) => {
          if (err) return done(err);

          const residentId = residentResult.insertId;

          // Insert the new user into Users table with linked Resident
          const userInsert = `
            INSERT INTO users (name, email, google_id, user_type, linked_table, linked_id, is_active)
            VALUES (?, ?, ?, 'Resident', 'Residents', ?, TRUE)
          `;
          const userValues = [name, email, googleId, residentId];

          pool.query(userInsert, userValues, (err, userResult) => {
            if (err) return done(err);
            
            // Create the new user object
            const newUser = {
              id: userResult.insertId,
              name,
              email,
              google_id: googleId
            };
            
            return done(null, newUser);
          });
        });
      }
    });
  } catch (error) {
    return done(error);
  }
}));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize by MySQL user ID
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    return done(null, results[0]);
  });
});

module.exports = passport;