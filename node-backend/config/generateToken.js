var jwt = require("jsonwebtoken");

function generateToken(payload) {
  const token = jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: 3600, //1 hours
  });
  return token;
}

module.exports = generateToken;
