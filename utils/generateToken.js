const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = generateToken;
