const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mongoURI: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y8voy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  //mongoURI: `mongodb+srv://hetvi:ZWroFD9C9JxeB845@cluster0.y8voy.mongodb.net/chatapp?retryWrites=true&w=majority`,
};
