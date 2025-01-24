const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' } 
  );
};

const comparePasswords = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = { generateToken, comparePasswords };
